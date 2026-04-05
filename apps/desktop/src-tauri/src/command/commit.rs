use chrono::{DateTime, Utc};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use serde::Serialize;
use specta::Type;
use tauri::State;

use crate::entity::commit;

#[derive(Debug, Serialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct Commit {
    pub id: i32,
    pub page_id: i32,
    pub phase: String,
    pub timestamp: f64,
    pub component_count: i32,
    pub total_time: f64,
    pub created_at: DateTime<Utc>,
}

impl From<commit::Model> for Commit {
    fn from(m: commit::Model) -> Self {
        Self {
            id: m.id,
            page_id: m.page_id,
            phase: m.phase,
            timestamp: m.timestamp,
            component_count: m.component_count,
            total_time: m.total_time,
            created_at: m.created_at,
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn list_commits(
    db: State<'_, DatabaseConnection>,
    page_id: i32,
) -> Result<Vec<Commit>, String> {
    commit::Entity::find()
        .filter(commit::Column::PageId.eq(page_id))
        .order_by_desc(commit::Column::Id)
        .all(db.inner())
        .await
        .map(|commits| commits.into_iter().map(Commit::from).collect())
        .map_err(|e| e.to_string())
}
