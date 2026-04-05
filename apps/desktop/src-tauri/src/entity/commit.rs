use sea_orm::entity::prelude::*;
use sea_orm::ActiveValue::Set;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "commit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub page_id: i32,
    /// "mount" | "update" | "unmount"
    pub phase: String,
    /// Timestamp from the React commit event (ms since epoch).
    pub timestamp: f64,
    /// Number of components in the tree.
    pub component_count: i32,
    /// Sum of all component totalTime values.
    pub total_time: f64,
    /// Full `ComponentNode` tree serialized as JSON.
    #[sea_orm(column_type = "Json")]
    pub tree_json: serde_json::Value,
    pub created_at: DateTimeUtc,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::page::Entity",
        from = "Column::PageId",
        to = "super::page::Column::Id"
    )]
    Page,
}

impl Related<super::page::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Page.def()
    }
}

#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    async fn before_save<C>(mut self, _db: &C, insert: bool) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if insert {
            self.created_at = Set(chrono::Utc::now());
        }
        Ok(self)
    }
}
