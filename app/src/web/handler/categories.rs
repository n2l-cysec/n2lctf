use std::collections::HashMap;

use axum::{
    body::Body,
    extract::{Multipart, Path, Query},
    http::{header, Response, StatusCode},
    response::IntoResponse,
    Extension, Json,
};
use sea_orm::{ActiveModelTrait, ActiveValue::NotSet, EntityTrait, Set};

use crate::{database::get_db, web::{self, model::Metadata}};
use crate::{model::submission::Status, web::traits::Ext};
use crate::{model::user::group::Group, web::model::categories::*};
use crate::{util::validate, web::traits::WebError};

pub async fn get() -> Result<impl IntoResponse, WebError> {

    let (categories, total) = crate::model::categories::show_all()
    .await?;

    return Ok((
        StatusCode::OK,
        Json(GetResponse {
            code: StatusCode::OK.as_u16(),
            data: categories,
            total: total,
        }),
    ));
}


pub async fn create(
    Extension(ext): Extension<Ext>, Json(body): Json<CreateRequest>,
) -> Result<impl IntoResponse, WebError> {
    let operator = ext.operator.ok_or(WebError::Unauthorized(String::new()))?;
    if operator.group != Group::Admin {
        return Err(WebError::Forbidden(String::new()));
    }

    let category = crate::model::categories::ActiveModel {
        name: Set(body.name),
        description: Set(body.description),
        icon: Set(body.icon),
        color: Set(body.color),
        ..Default::default()
    }
    .insert(&get_db())
    .await?;

    return Ok((
        StatusCode::OK,
        Json(CreateResponse {
            code: StatusCode::OK.as_u16(),
            data: category,
        }),
    ));
}

pub async fn update(
    Extension(ext): Extension<Ext>, Path(id): Path<i64>,
    validate::Json(mut body): validate::Json<UpdateRequest>,
) -> Result<impl IntoResponse, WebError> {
    let operator = ext.operator.ok_or(WebError::Unauthorized(String::new()))?;
    if operator.group != Group::Admin {
        return Err(WebError::Forbidden(String::new()));
    }

    body.id = Some(id);

    let category: crate::model::categories::Model = crate::model::categories::ActiveModel {
        id: body.id.map_or(NotSet, |v| Set(v)),
        name: body.name.map_or(NotSet, |v| Set(v)),
        description: body.description.map_or(NotSet, |v: String| Set(Some(v))),
        icon: body.icon.map_or(NotSet, |v| Set(v)),
        color: body.color.map_or(NotSet, |v| Set(v)),
        ..Default::default()
    }
    .update(&get_db())
    .await?;

    return Ok((
        StatusCode::OK,
        Json(UpdateResponse {
            code: StatusCode::OK.as_u16(),
            data: category,
        }),
    ));
}

pub async fn delete(
    Extension(ext): Extension<Ext>, Path(id): Path<i64>,
) -> Result<impl IntoResponse, WebError> {
    let operator = ext.operator.ok_or(WebError::Unauthorized(String::new()))?;
    if operator.group != Group::Admin {
        return Err(WebError::Forbidden(String::new()));
    }

    match crate::model::categories::Entity::delete_by_id(id)
        .exec(&get_db())
        .await {
        Ok(_) => Ok((
            StatusCode::OK,
            Json(DeleteResponse {
                code: StatusCode::OK.as_u16(),
            }),
        )),
        Err(err) => {
            Err(WebError::InternalServerError(format!("Failed to delete category: {}", err)))
        }
    }

}

