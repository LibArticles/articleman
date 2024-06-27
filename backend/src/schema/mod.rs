// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "billing_status"))]
    pub struct BillingStatus;

    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "entity_class"))]
    pub struct EntityClass;

    #[derive(diesel::query_builder::QueryId, diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "organization_transparency_status"))]
    pub struct OrganizationTransparencyStatus;
}

diesel::table! {
    account (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 40]
        idm_id -> Bpchar,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::BillingStatus;

    bill_recipient (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 3]
        iso_country -> Bpchar,
        #[max_length = 40]
        gateway_id -> Bpchar,
        status -> BillingStatus,
        settings -> Nullable<Jsonb>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::EntityClass;

    entity (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[sql_name = "type"]
        type_ -> EntityClass,
        #[max_length = 40]
        person_id -> Nullable<Bpchar>,
        #[max_length = 40]
        group_id -> Nullable<Bpchar>,
        #[max_length = 40]
        machine_id -> Nullable<Bpchar>,
    }
}

diesel::table! {
    group (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 40]
        entity_id -> Bpchar,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        settings -> Nullable<Jsonb>,
    }
}

diesel::table! {
    group_membership (entity_id) {
        #[max_length = 40]
        group_id -> Bpchar,
        #[max_length = 40]
        entity_id -> Bpchar,
    }
}

diesel::table! {
    machine (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 40]
        entity_id -> Bpchar,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        settings -> Nullable<Jsonb>,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::OrganizationTransparencyStatus;

    organization (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 40]
        parent_organization -> Nullable<Bpchar>,
        parent_transparency -> OrganizationTransparencyStatus,
        #[max_length = 40]
        managing_entity -> Nullable<Bpchar>,
        #[max_length = 40]
        bill_recipient -> Nullable<Bpchar>,
        #[max_length = 255]
        iso_language -> Nullable<Varchar>,
        primary_location -> Nullable<Json>,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        settings -> Nullable<Jsonb>,
    }
}

diesel::table! {
    organization_membership (entity_id) {
        #[max_length = 40]
        org_id -> Bpchar,
        #[max_length = 40]
        entity_id -> Bpchar,
    }
}

diesel::table! {
    person (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 40]
        entity_id -> Bpchar,
        settings -> Nullable<Jsonb>,
    }
}

diesel::table! {
    project (id) {
        #[max_length = 40]
        id -> Bpchar,
        title -> Varchar,
        #[max_length = 40]
        org -> Bpchar,
        #[max_length = 40]
        manager -> Bpchar,
        #[max_length = 40]
        schema_id -> Bpchar,
        data -> Nullable<Jsonb>,
    }
}

diesel::table! {
    project_type (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 40]
        org -> Bpchar,
        slug -> Varchar,
        #[max_length = 40]
        schema -> Bpchar,
        name -> Nullable<Varchar>,
        localized_names -> Nullable<Jsonb>,
    }
}

diesel::table! {
    project_type_schema (id) {
        #[max_length = 40]
        id -> Bpchar,
        #[max_length = 40]
        org -> Bpchar,
        #[max_length = 40]
        manager -> Bpchar,
        data -> Json,
    }
}

diesel::joinable!(group -> entity (entity_id));
diesel::joinable!(group_membership -> entity (entity_id));
diesel::joinable!(group_membership -> group (group_id));
diesel::joinable!(machine -> entity (entity_id));
diesel::joinable!(organization -> bill_recipient (bill_recipient));
diesel::joinable!(organization -> entity (managing_entity));
diesel::joinable!(organization_membership -> entity (entity_id));
diesel::joinable!(organization_membership -> organization (org_id));
diesel::joinable!(project -> entity (manager));
diesel::joinable!(project -> organization (org));
diesel::joinable!(project -> project_type_schema (schema_id));
diesel::joinable!(project_type -> organization (org));
diesel::joinable!(project_type -> project_type_schema (schema));
diesel::joinable!(project_type_schema -> entity (manager));
diesel::joinable!(project_type_schema -> organization (org));

diesel::allow_tables_to_appear_in_same_query!(
    account,
    bill_recipient,
    entity,
    group,
    group_membership,
    machine,
    organization,
    organization_membership,
    person,
    project,
    project_type,
    project_type_schema,
);
