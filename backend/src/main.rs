mod cli;
mod task;

#[tokio::main]
async fn main() {
    cli::parse().await;
}
