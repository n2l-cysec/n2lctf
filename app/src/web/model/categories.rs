
use serde::{Deserialize, Serialize};
use validator::Validate;



#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GetRequest {
    pub id: Option<i64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GetResponse {
    pub code: u16,
    pub data: Vec<crate::model::categories::Model>,
    pub total: u64,
}




#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRequest {
    pub name: String,
    pub color: String,
    pub description: Option<String>,
    pub icon: String,
}

#[derive(Debug, Serialize, Deserialize, Validate)]
pub struct UpdateRequest {
    pub id: Option<i64>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub color: Option<String>,
}


#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct CreateResponse {
    pub code: u16,
    pub data: crate::model::categories::Model,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct UpdateResponse {
    pub code: u16,
    pub data: crate::model::categories::Model,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DeleteResponse {
    pub code: u16,
}
