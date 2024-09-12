use crate::web::handler;
use axum::{
    routing::{delete, get, post, put},
    Router,
};

pub fn router() -> Router {
    return Router::new()
        .route("/", get(handler::categories::get))
        .route("/", post(handler::categories::create))
        .route("/:id", put(handler::categories::update))
        .route("/:id", delete(handler::categories::delete))
}
