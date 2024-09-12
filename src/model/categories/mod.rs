use axum::async_trait;
use sea_orm::{entity::prelude::*, Set};
use serde::{Deserialize, Serialize};

use crate::database::get_db;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "categories")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub name: String,
    pub icon: String,
    pub description: Option<String>,
    pub color: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    // Define your relations here, if needed
}

#[async_trait]
impl ActiveModelBehavior for ActiveModel {
    fn new() -> Self {
        Self {
            created_at: Set(chrono::Utc::now().timestamp()),
            updated_at: Set(chrono::Utc::now().timestamp()),
            ..ActiveModelTrait::default()
        }
    }

    async fn before_save<C>(mut self, _db: &C, _insert: bool) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        self.updated_at = Set(chrono::Utc::now().timestamp());
        Ok(self)
    }
}


pub async fn delete_by_id(id: i64) -> Result<(), DbErr> {
    crate::model::categories::Entity::delete_by_id(id)
        .exec(&get_db())
        .await
        .map_err(|err| {
            // Map the error to your desired error type
            eprintln!("Error deleting category by ID: {:?}", err);
            DbErr::Custom("Failed to delete category".into())
        })?;
    return Ok(());
}
pub async fn show_all(
    // id: Option<i64>
) -> Result<(Vec<crate::model::categories::Model>, u64), DbErr> {
    let query = crate::model::categories::Entity::find();
    // if let Some(category_id) = id {
    //     query = query.filter(crate::model::categories::Column::Id.eq(category_id));
    // }
    let total = query.clone().count(&get_db()).await?;

    let categories = query.all(&get_db()).await?;
    return Ok((categories, total));
}