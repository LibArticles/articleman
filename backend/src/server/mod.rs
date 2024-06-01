pub async fn run_server() {
    let rocket = rocket::build().mount("/", routes![hello_world]);
    let launched = rocket.launch().await;
}

#[get("/")]
pub async fn hello_world() -> &'static str {
    "Articleman, articleman. Does whatever your manager can!"
}