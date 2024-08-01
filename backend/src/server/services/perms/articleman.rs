use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub enum Perm {}

#[derive(Serialize, Deserialize, Debug)]
pub enum EntActionType {
    CreateUserUnder,
}

#[derive(Serialize, Deserialize, Debug)]
pub enum EntActionTarget {
    Entity(String),
    Project(String),
    Person(String),
    Group(String),
    Organization(String),
    
}

pub struct AMEntAction {
    pub act: EntActionType,
    pub ent: String,
    pub target: EntActionTarget
}

pub trait AMAction {}

impl AMAction for EntActionType {}
