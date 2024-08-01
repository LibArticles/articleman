//! Articleman unique ID generator service

/// generate a generic uuidv7 and convert it to a string
fn generate_generic_amid(prefix: &str) -> String {
    assert_eq!(prefix.len(), 3, "AMid prefix length must be 3 characters.");
    let mut id = uuid7::uuid7().to_string();
    id.insert_str(0, &(prefix.to_owned() + "-"));
    id
}

/// generate a new organization uuid
pub fn new_org_id() -> String {
    generate_generic_amid("org")
}

/// generate a new person uuid
pub fn new_person_id() -> String {
    generate_generic_amid("per")
}

/// generate a new TaskMon uuid.
pub fn new_taskmon_id() -> String {
    generate_generic_amid("tmo")
}