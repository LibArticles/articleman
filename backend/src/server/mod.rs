use axum::Router;
use axum_server::Handle;

use crate::config::AMOpt;
use std::{net::{Ipv4Addr, SocketAddr, SocketAddrV4}, time::Duration};

mod services;
mod db;
mod state;
mod idm;

pub async fn run_api_server(config: AMOpt) {
    
    let app = Router::new()
        .route("/hello-world", axum::routing::get(hello_world))
        .layer(tower_http::trace::TraceLayer::new_for_http());

    let addr: SocketAddrV4 = config
        .insec_api_listen_addr
        .parse()
        .expect("Was unable to parse the IP address given.");
    let shutdown_handle = Handle::new();
    tokio::spawn(handle_graceful_shutdown(shutdown_handle.clone()));
    let _server = axum_server::bind(SocketAddr::from(addr))
        // TODO: .with_graceful_shutdown(shutdown_signal())
        .handle(shutdown_handle)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn handle_graceful_shutdown(handle: Handle) {
    shutdown_signal().await;
    tracing::info!("Waiting 10 seconds for a graceful shutdown. {} requests in flight.", handle.connection_count());
    handle.graceful_shutdown(Some(Duration::from_secs(10)));
    tracing::info!("Articleman's web server has been shut down.");
}

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
}

#[tracing::instrument]
pub async fn hello_world() -> &'static str {
    "Articleman, articleman. Does whatever your manager can!"
}
