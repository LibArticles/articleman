mod services;

pub async fn run_server() {
    let app_routes = axum::Router::new()
        .route("/hello-world", axum::routing::get(hello_world))
        .layer(tower_http::trace::TraceLayer::new_for_http());

    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    tracing::info!("listening on {}", &listener.local_addr().unwrap());
    let server = axum::serve(listener, app_routes)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

/// Graceful shutdown code from https://github.com/matze/wastebin/blob/master/src/main.rs#L58C1-L82C2
async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        () = ctrl_c => {},
        () = terminate => {},
    }

    tracing::info!("received signal, exiting ...");
}

#[tracing::instrument]
pub async fn hello_world() -> &'static str {
    "Articleman, articleman. Does whatever your manager can!"
}
