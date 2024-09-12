use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use validator::Validate;


use super::Metadata;

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

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct StatusResponse {
    pub is_solved: bool,
    pub solved_times: i64,
    pub pts: i64,
    pub bloods: Vec<crate::model::submission::Model>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GetStatusResponse {
    pub code: u16,
    pub data: HashMap<i64, StatusResponse>,
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

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GetAttachmentMetadataResponse {
    pub code: u16,
    pub data: Metadata,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SaveAttachmentResponse {
    pub code: u16,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DeleteAttachmentResponse {
    pub code: u16,
}
