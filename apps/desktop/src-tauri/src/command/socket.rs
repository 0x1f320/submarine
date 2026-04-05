use tauri::State;

use crate::socket::{SocketState, SocketStatus};

/// Return the port the Socket.IO server is listening on.
#[tauri::command]
#[specta::specta]
#[allow(clippy::needless_pass_by_value)]
pub fn get_socket_port(state: State<'_, SocketState>) -> u16 {
    state.port
}

/// Return a snapshot of the Socket.IO server status.
#[tauri::command]
#[specta::specta]
#[allow(clippy::needless_pass_by_value)]
pub fn get_socket_status(state: State<'_, SocketState>) -> SocketStatus {
    let connected_clients = state.io.of("/").map_or(0, |ns| ns.sockets().len());

    SocketStatus {
        listening: true,
        port: state.port,
        connected_clients,
        connected_projects: state.connected_projects.list(),
    }
}
