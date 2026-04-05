use std::collections::HashSet;
use std::sync::{Arc, Mutex};

use sea_orm::{ActiveModelTrait, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, Set};
use serde::{Deserialize, Serialize};
use socketioxide::{
    extract::{Data, Extension, SocketRef, State},
    SocketIo,
};
use submarine_types::{CommitData, ComponentNode};
use tokio::net::TcpListener;
use tracing::{info, warn};
use url::Url;

use crate::entity::{commit, page, project};

/// Shared set of project IDs with active socket connections.
#[derive(Debug, Clone, Default)]
pub struct ConnectedProjects(Arc<Mutex<HashSet<i32>>>);

impl ConnectedProjects {
    fn insert(&self, project_id: i32) {
        self.0.lock().unwrap().insert(project_id);
    }

    fn remove(&self, project_id: i32) {
        self.0.lock().unwrap().remove(&project_id);
    }

    pub fn list(&self) -> Vec<i32> {
        self.0.lock().unwrap().iter().copied().collect()
    }
}

/// Managed state holding Socket.IO server info.
pub struct SocketState {
    pub port: u16,
    pub io: SocketIo,
    pub connected_projects: ConnectedProjects,
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
    /// Project IDs with active connections.
    pub connected_projects: Vec<i32>,
}

/// Auth payload sent by `@submarine/react` on connect.
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AuthData {
    page_url: String,
}

/// Per-socket extension storing the resolved page ID.
#[derive(Debug, Clone)]
struct PageId(i32);

/// Per-socket extension storing the resolved project ID.
#[derive(Debug, Clone)]
struct ProjectId(i32);

/// Start the Socket.IO server on an OS-assigned port.
///
/// Returns a [`SocketState`] that should be registered as Tauri managed state.
pub async fn start(db: DatabaseConnection) -> SocketState {
    let connected_projects = ConnectedProjects::default();
    let (svc, io) = SocketIo::builder()
        .with_state(db)
        .with_state(connected_projects.clone())
        .build_svc();

    io.ns("/", on_connect);

    let listener = TcpListener::bind("127.0.0.1:45323")
        .await
        .expect("Failed to bind Socket.IO listener");

    let port = listener.local_addr().unwrap().port();
    info!(port, "Socket.IO server listening");

    let socket_state = SocketState {
        port,
        io: io.clone(),
        connected_projects,
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
                        .serve_connection_with_upgrades(hyper_util::rt::TokioIo::new(stream), svc)
                        .await;
                });
            }
        }
    });

    socket_state
}

/// Called when a new Socket.IO client connects to the `/` namespace.
async fn on_connect(
    socket: SocketRef,
    Data(auth): Data<AuthData>,
    State(db): State<DatabaseConnection>,
    State(connected): State<ConnectedProjects>,
) {
    let sid = socket.id;
    info!(%sid, page_url = %auth.page_url, "client connected");

    match resolve_page(&db, &auth.page_url).await {
        Ok((project_id, page_id)) => {
            socket.extensions.insert(PageId(page_id));
            socket.extensions.insert(ProjectId(project_id));
            connected.insert(project_id);
            info!(%sid, project_id, page_id, "page resolved");
        }
        Err(e) => {
            warn!(%sid, error = %e, "failed to resolve page, commits will not be persisted");
            return;
        }
    }

    socket.on(
        "commit",
        |Data::<CommitData>(commit_data),
         Extension::<PageId>(PageId(page_id)),
         State::<DatabaseConnection>(db)| async move {
            if let Err(e) = persist_commit(&db, page_id, &commit_data).await {
                warn!(error = %e, "failed to persist commit");
            }
        },
    );

    socket.on_disconnect(
        |socket: SocketRef,
         Extension::<ProjectId>(ProjectId(project_id)),
         State::<ConnectedProjects>(connected)| async move {
            connected.remove(project_id);
            info!(sid = %socket.id, project_id, "client disconnected");
        },
    );
}

// ---------------------------------------------------------------------------
// Database helpers
// ---------------------------------------------------------------------------

/// Parse the URL, find-or-create the Project (by host) and Page (by full URL).
/// Returns `(project_id, page_id)`.
async fn resolve_page(db: &DatabaseConnection, raw_url: &str) -> Result<(i32, i32), String> {
    let parsed = Url::parse(raw_url).map_err(|e| format!("invalid URL: {e}"))?;

    let host = match parsed.port() {
        Some(port) => format!(
            "{}://{}:{port}",
            parsed.scheme(),
            parsed.host_str().unwrap_or("localhost")
        ),
        None => format!(
            "{}://{}",
            parsed.scheme(),
            parsed.host_str().unwrap_or("localhost")
        ),
    };

    // Find or create project by host
    let proj = project::Entity::find()
        .filter(project::Column::Host.eq(&host))
        .one(db)
        .await
        .map_err(|e| e.to_string())?;

    let proj = if let Some(p) = proj { p } else {
        let model = project::ActiveModel {
            name: Set(host.clone()),
            path: Set(String::new()),
            host: Set(host),
            ..Default::default()
        };
        model.insert(db).await.map_err(|e| e.to_string())?
    };

    // Find or create page by URL
    let pg = page::Entity::find()
        .filter(page::Column::ProjectId.eq(proj.id))
        .filter(page::Column::Url.eq(raw_url))
        .one(db)
        .await
        .map_err(|e| e.to_string())?;

    let pg = if let Some(p) = pg { p } else {
        let model = page::ActiveModel {
            project_id: Set(proj.id),
            url: Set(raw_url.to_string()),
            ..Default::default()
        };
        model.insert(db).await.map_err(|e| e.to_string())?
    };

    Ok((proj.id, pg.id))
}

/// Count components in the tree recursively.
fn count_components(node: &ComponentNode) -> i32 {
    1 + node.children.iter().map(count_components).sum::<i32>()
}

/// Sum `total_time` across all nodes.
fn sum_total_time(node: &ComponentNode) -> f64 {
    let self_time = node.timings.as_ref().map_or(0.0, |t| t.total_time);
    self_time + node.children.iter().map(sum_total_time).sum::<f64>()
}

/// Persist a single commit to the database.
async fn persist_commit(
    db: &DatabaseConnection,
    page_id: i32,
    data: &CommitData,
) -> Result<(), String> {
    let tree_json =
        serde_json::to_value(&data.tree).map_err(|e| format!("failed to serialize tree: {e}"))?;

    let phase = serde_json::to_value(&data.phase)
        .ok()
        .and_then(|v| v.as_str().map(String::from))
        .unwrap_or_default();

    let model = commit::ActiveModel {
        page_id: Set(page_id),
        phase: Set(phase),
        timestamp: Set(data.timestamp),
        component_count: Set(count_components(&data.tree)),
        total_time: Set(sum_total_time(&data.tree)),
        tree_json: Set(tree_json),
        ..Default::default()
    };

    model.insert(db).await.map_err(|e| e.to_string())?;
    Ok(())
}
