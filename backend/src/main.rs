mod cli;
mod server;
mod config;
mod schema;
use cli::Action;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    let fmt_layer = tracing_subscriber::fmt().with_max_level(tracing::Level::TRACE).with_target(false).init();
    let filter_layer = tracing_subscriber::EnvFilter::try_from_default_env()
        .or_else(|_| tracing_subscriber::EnvFilter::try_new("info"))
        .unwrap();

    tracing::debug!("Tracing started successfully.");
    let action = cli::parse().await;
    match action {
        Action::ServerStart(cli::ServerTarget::APIOnly) => {
            server::run_server().await;
        }
        _ => {}
    }
    tracing::debug!("Articleman is exiting.");
}
