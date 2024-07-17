mod cli;
mod config;
mod schema;
mod server;
use cli::Action;
// use tracing_subscriber;

#[tokio::main]
async fn main() {
    start_tracing();
    let action = cli::parse().await;
    match action {
        Ok(Action::ServerStart(config)) => {
            server::run_api_server(config).await;
        }
        Err(error) => {
            panic!("Articleman couldn't initialize: {}", error);
        }
        _ => {}
    }
    tracing::debug!("Articleman is exiting.");
}

fn start_tracing() {
    tracing::trace!("Hello world! Tracing started successfully.");
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::TRACE)
        .with_target(false)
        .init();
    tracing_subscriber::EnvFilter::try_from_default_env()
        .or_else(|_| tracing_subscriber::EnvFilter::try_new("info"))
        .unwrap();
}
