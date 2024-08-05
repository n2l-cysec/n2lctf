use once_cell::sync::Lazy;
use sea_orm::{
    ActiveModelTrait, ColumnTrait, Condition, EntityTrait, IntoActiveModel, QueryFilter,
    QueryOrder, Set,
};
use tokio::sync::{mpsc, Mutex};
use tracing::info;

use crate::{database::get_db, model::submission::Status};

static CHANNEL: Lazy<(
    mpsc::UnboundedSender<i64>,
    Mutex<mpsc::UnboundedReceiver<i64>>,
)> = Lazy::new(|| {
    let (tx, rx) = mpsc::unbounded_channel();
    return (tx, Mutex::new(rx));
});

pub fn get_tx() -> mpsc::UnboundedSender<i64> {
    return CHANNEL.0.clone();
}

async fn check(id: i64) {
    let submission = crate::model::submission::Entity::find()
        .filter(
            Condition::all()
                .add(crate::model::submission::Column::Id.eq(id))
                .add(crate::model::submission::Column::Status.eq(Status::Pending)),
        )
        .one(&get_db())
        .await
        .unwrap();

    if submission.is_none() {
        return;
    }

    let submission = submission.unwrap();

    let user = crate::model::user::Entity::find_by_id(submission.user_id)
        .one(&get_db())
        .await
        .unwrap();

    if user.is_none() {
        crate::model::submission::Entity::delete_by_id(submission.id)
            .exec(&get_db())
            .await
            .unwrap();
        return;
    }

    let user = user.unwrap();

    // Get related challenge
    let challenge = crate::model::challenge::Entity::find_by_id(submission.challenge_id)
        .one(&get_db())
        .await
        .unwrap();

    if challenge.is_none() {
        crate::model::submission::Entity::delete_by_id(submission.id)
            .exec(&get_db())
            .await
            .unwrap();
        return;
    }

    let challenge = challenge.unwrap();

    let exist_submissions = crate::model::submission::Entity::find()
        .filter(
            Condition::all()
                .add(crate::model::submission::Column::ChallengeId.eq(submission.challenge_id))
                .add(submission.game_id.map_or(Condition::all(), |game_id| {
                    Condition::all().add(crate::model::submission::Column::GameId.eq(game_id))
                }))
                .add(crate::model::submission::Column::Status.eq(Status::Correct)),
        )
        .all(&get_db())
        .await
        .unwrap();

    let mut status: Status = Status::Incorrect;

    match challenge.is_dynamic {
        true => {
            // Dynamic challenge, verify flag correctness from pods
            let pods = crate::model::pod::Entity::find()
                .filter(
                    Condition::all()
                        .add(
                            crate::model::pod::Column::RemovedAt
                                .gte(chrono::Utc::now().timestamp()),
                        )
                        .add(crate::model::pod::Column::ChallengeId.eq(submission.challenge_id))
                        .add(submission.game_id.map_or(Condition::all(), |game_id| {
                            Condition::all().add(crate::model::pod::Column::GameId.eq(game_id))
                        })),
                )
                .all(&get_db())
                .await
                .unwrap();

            for pod in pods {
                if pod.flag == Some(submission.flag.clone()) {
                    if pod.user_id == submission.user_id || submission.team_id == pod.team_id {
                        status = Status::Correct;
                        break;
                    } else {
                        status = Status::Cheat;
                        break;
                    }
                }
            }
        }
        false => {
            // Static challenge
            for flag in challenge.flags.clone() {
                if flag.value == submission.flag {
                    if flag.banned {
                        status = Status::Cheat;
                        break;
                    } else {
                        status = Status::Correct;
                    }
                }
            }
        }
    }

    for exist_submission in exist_submissions {
        if exist_submission.user_id == submission.user_id
            || (submission.game_id.is_some() && exist_submission.team_id == submission.team_id)
        {
            status = Status::Invalid;
            break;
        }
    }

    info!(
        "Submission #{}, status: {:?}, user: {}",
        submission.id, status, user.username
    );

    let mut submission = submission.into_active_model();
    submission.status = Set(status);

    submission.update(&get_db()).await.unwrap();
}

async fn recover() {
    let unchecked_submissions = crate::model::submission::Entity::find()
        .filter(crate::model::submission::Column::Status.eq(Status::Pending))
        .order_by_asc(crate::model::submission::Column::CreatedAt)
        .all(&get_db())
        .await
        .unwrap();

    for submission in unchecked_submissions {
        let id = submission.id;
        get_tx().send(id).unwrap();
    }
}

pub async fn init() {
    tokio::spawn(async move {
        let mut rx = CHANNEL.1.lock().await;
        while let Some(id) = rx.recv().await {
            check(id).await;
        }
    });
    recover().await;
    info!("Checker initialized successfully.");
}
