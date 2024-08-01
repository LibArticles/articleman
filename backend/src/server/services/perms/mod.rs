mod approval;
mod gcs;
mod articleman;

pub enum AMPermGrant {
    /// give this entity full, unconditional permissions to carry out an action and grant it to any organizations they manage
    FullAccess,

    /// give this entity access to perform the action that the permission grants, without being able to grant it to others or approve requests
    NonTransferrable,

    /// allow this entity to request nontransferrable permissions from the nearest managing entity with full access to this capability on a case-by-case basis.
    Requestable,
}


