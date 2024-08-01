# The Task System

1. caller requests <action> access on <target> as <entity> by either requesting a Task ID or calling the service API
  1a. actions can be as simple as "delete", or they can include data on the exact thing being modified, like a diff, a desired state or an addon to install.
  1b. if capability grant specifies an approval requirement, the permissions system returns information about that before the action is attempted and adds it to the approval queue. the approving entity can now see it as an approvable task.
2. permissions system allocates the task ID and returns it to requesting caller or service API gateway, and saves it with accompanying one-time permissions to in-memory or persistent storage.
  2a.
3. service executors being called are passed the task ID as their first parameter and are required to validate it. for pool-based services the TID is passed on pool item retrieval.
4. when a service function terminates, Articleman deallocates the task ID and revokes the permissions.

service executors should NEVER be callable without a task ID.

after the initial setup, no "system-level" actions should be taken by Articleman while it's online and capable of serving API requests. migrations happen when Articleman is offline, so they don't count.

## The theory
The ability to alter system state cannot be derived from thin air, and it cannot be limitless. Every state-altering service within Articleman should have context and executor information, and if the system is not aware of an initiating entity for an action, they shouldn't be able to do anything.

```rust
/// service public API to delete user, should handle permissions checks and waiting for. this function should not be privileged.
pub fn delete_user(user: User, executor_ent: Entity) -> Result<String, Error> {
    match perms::request_tid( /* do */ Action::DeleteUser( /* to */ user.id), /* as */ executor_ent).await {
        Task(tid) => {
            delete_user_tid(input, tid)
        },
        ApprovalRequired(handle) => {
            // queue an action in a queue that will trigger and delete the user if approved. this will disappear 
            approval::wait_for_approved(handle, Action::DeleteUser(user.id));
            ApprovalRequired(handle)
        },
        Error(err) => {
            Error("Executing entity doesn't have permission to run Action::DeleteUser.")
        }
    }
}

/// service private API that only has to check TID for validity, and can then do whatever it wants
fn delete_user_tid(input: User, tid: String) {
    perms::validate_tid(tid, /* do */ Action::DeleteUser(user.id)).await.expect("An invalid or expired Task ID can't be used for user deletion.");
    // actually delete the user
}
```

# Grant bitmasks
## 0b0000
Entity cannot perform the action

## 0b0001
Entity can request individual accesses to the action

## 0b0010
Entity can perform the action on their own

## 0b0100
Entity can approve requests to perform the action from entities they manage

## 0b1000
Entity can grant entities they manage access to perform the action on their own