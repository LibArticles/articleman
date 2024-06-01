#[macro_use]
extern crate rocket;

mod cli;
mod server;
mod task;
use cli::action::Action;

#[rocket::main]
async fn main() {
    let action = cli::parse().await;
    match action {
        Action::ServerStart(cli::action::ServerTarget::APIOnly) => {
            server::run_server().await;
        }
        _ => {}
    }
}
