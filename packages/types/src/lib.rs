use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

/// Render timing data from React Profiler.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Timings {
    #[serde(rename = "selfTime")]
    pub self_time: f64,
    #[serde(rename = "totalTime")]
    pub total_time: f64,
}

/// Component type classification matching React fiber tags.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(rename_all = "kebab-case")]
pub enum ComponentKind {
    Function,
    Class,
    Host,
    Memo,
    ForwardRef,
    Suspense,
    Context,
    Fragment,
    Root,
    Other,
}

/// A parsed React component node in the tree.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct ComponentNode {
    /// Stable ID persisted across re-renders.
    #[ts(type = "number")]
    pub id: i64,
    /// Display name (e.g. "App", "Button", "div").
    pub name: String,
    /// Component type classification.
    pub kind: ComponentKind,
    /// Current props snapshot.
    #[ts(type = "Record<string, unknown>")]
    pub props: HashMap<String, serde_json::Value>,
    /// Render timing (only available with React Profiler).
    pub timings: Option<Timings>,
    /// Whether this fiber rendered in the last commit.
    pub rendered: bool,
    /// Whether React Compiler memo cache is active.
    pub memoized: bool,
    /// Associated DOM element tag name, if any.
    #[serde(rename = "hostTag")]
    pub host_tag: Option<String>,
    /// Depth in the component tree (0 = root).
    pub depth: u32,
    /// Children component nodes.
    pub children: Vec<ComponentNode>,
}

/// The phase that triggered a React render (matches bippy's `RenderPhase`).
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(rename_all = "lowercase")]
pub enum RenderPhase {
    Mount,
    Update,
    Unmount,
}

/// Data for a single React commit event.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct CommitData {
    /// The phase that triggered this commit.
    pub phase: RenderPhase,
    /// Parsed component tree for this root.
    pub tree: ComponentNode,
    /// Timestamp of the commit.
    pub timestamp: f64,
}

// ---------------------------------------------------------------------------
// Socket.IO event payloads
// ---------------------------------------------------------------------------

/// Events sent from the instrumented browser (`@submarine/react`) to the
/// Tauri backend via Socket.IO.
#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
#[serde(tag = "type", content = "data")]
pub enum ClientToServer {
    /// A React commit was captured.
    #[serde(rename = "commit")]
    Commit(CommitData),
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn export_ts_bindings() {
        ComponentNode::export_all().expect("Failed to export ComponentNode");
        CommitData::export_all().expect("Failed to export CommitData");
        ClientToServer::export_all().expect("Failed to export ClientToServer");
    }
}
