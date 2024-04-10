mod cli;

#[tokio::main]
async fn main() {
    cli::parse().await;
}
