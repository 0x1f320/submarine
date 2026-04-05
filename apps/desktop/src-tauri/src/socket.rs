use serde::Serialize;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use submarine_types::CommitData;
use tokio::net::TcpListener;
use tracing::info;

/// Managed state holding Socket.IO server info.
pub struct SocketState {
    pub port: u16,
    pub io: SocketIo,
}

/// Snapshot of the Socket.IO server status returned to the frontend.
#[derive(Debug, Clone, Serialize, specta::Type)]
#[serde(rename_all = "camelCase")]
pub struct SocketStatus {
    /// Whether the server is listening for connections.
    pub listening: bool,
    /// Port the server is bound to.
    pub port: u16,
    /// Number of currently connected clients.
    pub connected_clients: usize,
}

/// Start the Socket.IO server on an OS-assigned port.
///
/// Returns a [`SocketState`] that should be registered as Tauri managed state.
pub async fn start() -> SocketState {
    let (svc, io) = SocketIo::builder().build_svc();

    io.ns("/", on_connect);

    let listener = TcpListener::bind("127.0.0.1:0")
        .await
        .expect("Failed to bind Socket.IO listener");

    let port = listener.local_addr().unwrap().port();
    info!(port, "Socket.IO server listening");

    let socket_state = SocketState {
        port,
        io: io.clone(),
    };

    tauri::async_runtime::spawn(async move {
        loop {
            if let Ok((stream, _addr)) = listener.accept().await {
                let svc = svc.clone();
                tauri::async_runtime::spawn(async move {
                    let builder = hyper_util::server::conn::auto::Builder::new(
                        hyper_util::rt::TokioExecutor::new(),
                    );
                    let _ = builder
                        .serve_connection(
                            hyper_util::rt::TokioIo::new(stream),
                            svc,
                        )
                        .await;
                });
            }
        }
    });

    socket_state
}

/// Called when a new Socket.IO client connects to the `/` namespace.
async fn on_connect(socket: SocketRef) {
    let sid = socket.id;
    info!(%sid, "client connected");

    socket.on("commit", |Data::<CommitData>(commit)| async move {
        info!(phase = ?commit.phase, "received commit");
    });

    socket.on_disconnect(|socket: SocketRef| async move {
        info!(sid = %socket.id, "client disconnected");
    });
}
