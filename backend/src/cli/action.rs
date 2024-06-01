pub enum Action {
    ServerStart(ServerTarget),
    ServerStop(ServerTarget),
    
    NoOp
}

pub enum ServerTarget {
    APIOnly,
    FrontendOnly,
    AllServices,
}
