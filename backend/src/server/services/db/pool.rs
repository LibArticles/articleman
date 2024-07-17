// use diesel::result::Error;
use diesel_async::pooled_connection::deadpool::{self, BuildError, Pool};
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
// use diesel_async::{AsyncConnection, RunQueryDsl};
// use futures_util::FutureExt;

fn init_db(conn_url: &String) -> Result<deadpool::Pool<diesel_async::AsyncPgConnection>, BuildError> {
    let config = AsyncDieselConnectionManager::<diesel_async::AsyncPgConnection>::new(conn_url);
    Pool::builder(config).build()
}
