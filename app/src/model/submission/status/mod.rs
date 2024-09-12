use sea_orm::{DeriveActiveEnum, EnumIter};
use serde_repr::{Deserialize_repr, Serialize_repr};

#[derive(
    Clone,
    Debug,
    Default,
    PartialEq,
    Eq,
    Serialize_repr,
    Deserialize_repr,
    EnumIter,
    DeriveActiveEnum,
)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
#[repr(i32)]
pub enum Status {
    #[default]
    Pending = 0,
    Correct = 1,
    Incorrect = 2,
    Cheat = 3,
    Invalid = 4,
}
