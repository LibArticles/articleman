use diesel_async::pooled_connection::deadpool;
use crate::config::AMOpt;


pub struct AMServerState {
    pub db: deadpool::Pool<diesel_async::AsyncPgConnection>,
    pub config: AMOpt
}