//! gra

use crate::server::services::{amid, entity::Entity};
use super::articleman::EntActionType;

use serde::{Deserialize, Serialize};
use std::{collections::BTreeMap, u64};


#[derive(Serialize, Deserialize)]
struct Task {
    /// TID of the task
    id: u64,
    /// the actions that this task can be used to authenticate
    action: Vec<EntActionType>,
    /// the originating entity for the task
    executor: Entity,
    /// unix timestamp at which the task was created
    created: i64,
    /// unix timestamp at which the task will become invalidated
    expires: i64,
}

pub struct TaskMon {
    tasks: BTreeMap<u64, Task>,
    id: String,
    last_id: u64
}


impl TaskMon {
    pub fn new(self: TaskMon) -> TaskMon {
        TaskMon {
            tasks: BTreeMap::new(),
            id: amid::new_taskmon_id(),
            last_id: u64::MAX
        }
    }
    
    pub fn request_tid(super::articleman::EntActionType) -> u64 {
        
    }
}