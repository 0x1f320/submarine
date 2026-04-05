use chrono::{DateTime, Utc};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use serde::Serialize;
use specta::Type;
use tauri::State;

use crate::entity::page;

#[derive(Debug, Serialize, Type)]
pub struct Page {
    pub id: i32,
    pub project_id: i32,
    pub url: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<page::Model> for Page {
    fn from(m: page::Model) -> Self {
        Self {
            id: m.id,
            project_id: m.project_id,
            url: m.url,
            created_at: m.created_at,
            updated_at: m.updated_at,
        }
    }
}

#[tauri::command]
#[specta::specta]
pub async fn list_pages(
    db: State<'_, DatabaseConnection>,
    project_id: i32,
) -> Result<Vec<Page>, String> {
    page::Entity::find()
        .filter(page::Column::ProjectId.eq(project_id))
        .all(db.inner())
        .await
        .map(|pages| pages.into_iter().map(Page::from).collect())
        .map_err(|e| e.to_string())
}
