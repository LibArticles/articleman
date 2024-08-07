-- BEGIN;

CREATE EXTENSION pg_jsonschema;

/* any char(40) types are UUIDv7s with a three-character prefix,
   matching their use. ex: "org-[UUID]", "ent-[uuid]"
   there's no real reason for this other than easy differentiation,
   and extra assurance that between different parts of Articleman, there
   won't be any UUID collisions. it's basically a namespace. */

/* all organizations have a managing_entity that retains full power over
   the org. in standalone organizations, this managing_entity is created
   specifically to manage the organization and it's typically a group.
   this allows a standalone org to have clean leadership transitions and
   multiple leaders with equal footing.
   in orgs that exist within other orgs, the man_ent is a member of the owning
   organization and could be of any type. this would let a school district be
   an organization, have individual organizations for each school and managed
   by a principal or program manager, and then from there a separate org
   can be created for each team, like journo, ybk, litmag, etc */
CREATE TABLE "organization" (
    "id" char(40) NOT NULL PRIMARY KEY,

    /* the organization's parent. for standalone orgs, this is the
    system root org, and for nested orgs it's just the parent. */
    "parent_organization" char(40) REFERENCES "organization",
    "parent_transparency" organization_transparency_status NOT NULL,
    "managing_entity" char(40),
    "bill_recipient" char(40) REFERENCES "bill_recipient",
    "iso_language" varchar(255),
    "primary_location" json,
    "name" varchar(255),
    "settings" jsonb
);

CREATE TYPE "entity_class" AS ENUM (
    'person', -- a human-looking user
    'group', -- a group consisting of and representing multiple other entities
    'machine' -- 
);

/* The basic unit for all permissions,
   an entity can either be a person, group or machine
   entities can be managed by other entities. */
CREATE TABLE "entity" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "type" entity_class NOT NULL,
    "person_id" char(40) UNIQUE,
    "group_id" char(40) UNIQUE,
    "machine_id" char(40) UNIQUE,
    "idm_id" char(40) UNIQUE NULLS NOT DISTINCT -- not every entity has an idm id
    CONSTRAINT check_ent_only_is_one_type CHECK (
        num_nonnulls("person_id", "group_id", "machine_id") = 1
    )
);

/* Users can be members of multiple organizations or teams. */
CREATE TABLE "organization_membership" (
    "org_id" char(40) NOT NULL REFERENCES "organization",
    "entity_id" char(40) NOT NULL PRIMARY KEY REFERENCES "entity"
);

CREATE INDEX "idx_organization_membership_org" ON "organization_membership" ("org_id");



ALTER TABLE "organization" ADD CONSTRAINT "fk_manent" FOREIGN KEY (
    "managing_entity"
) REFERENCES "entity";

CREATE TABLE "person" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "entity_id" char(40) UNIQUE NOT NULL REFERENCES "entity",
    "settings" jsonb
);

-- a person may have multiple names
CREATE TABLE "person_name" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "person_id" char(40) NOT NULL REFERENCES "person",
    "name_text" varchar(1024) NOT NULL
);

CREATE TABLE "group" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "entity_id" char(40) NOT NULL REFERENCES "entity",
    "name" varchar(255) NOT NULL,
    "settings" jsonb
);

CREATE TABLE "group_membership" (
    "group_id" char(40) NOT NULL REFERENCES "group",
    "entity_id" char(40) NOT NULL PRIMARY KEY REFERENCES "entity"
);

CREATE INDEX "idx_group_membership_group" ON "group_membership" ("group_id");


CREATE TABLE "machine" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "entity_id" char(40) UNIQUE NOT NULL REFERENCES "entity",
    "name" varchar(255),
    "settings" jsonb
);


ALTER TABLE entity ADD CONSTRAINT "fk_pid" FOREIGN KEY (
    "person_id"
) REFERENCES "person";
ALTER TABLE entity ADD CONSTRAINT "fk_gid" FOREIGN KEY (
    "group_id"
) REFERENCES "group";
ALTER TABLE entity ADD CONSTRAINT "fk_mid" FOREIGN KEY (
    "machine_id"
) REFERENCES "machine";

CREATE OR REPLACE FUNCTION check_json_schema_validity()
RETURNS trigger AS $$
BEGIN
    -- check if the json schema is valid
    IF NOT jsonschema_is_valid(NEW.data) THEN
        RAISE EXCEPTION 'Invalid JSON schema';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Schema
CREATE TABLE "project_type_schema" (
    "id" char(40) PRIMARY KEY,
    "org" char(40) NOT NULL REFERENCES "organization",
    "manager" char(40) NOT NULL REFERENCES "entity",
    -- this was originally like three separate fields,
    -- but i realized it could just be a json schema.
    "data" json NOT NULL
);

-- create the trigger to call the function before insert or update
CREATE TRIGGER json_schema_validation_trigger
BEFORE INSERT OR UPDATE ON "project_type_schema"
FOR EACH ROW EXECUTE FUNCTION check_json_schema_validity();

-- for custom project types
CREATE TABLE "project_type" (
    "id" char(40) PRIMARY KEY,
    "org" char(40) NOT NULL REFERENCES "organization",
    "slug" varchar NOT NULL,
    "schema" char(40) NOT NULL REFERENCES "project_type_schema",
    "name" varchar,
    "localized_names" jsonb
);

CREATE TABLE "project" (
    "id" char(40) PRIMARY KEY,
    "title" varchar NOT NULL,
    "org" char(40) NOT NULL REFERENCES "organization",
    "manager" char(40) NOT NULL REFERENCES "entity",
    "schema_id" char(40) NOT NULL REFERENCES "project_type_schema",
    "data" jsonb
);

-- create the function to check json schema compliance
CREATE OR REPLACE FUNCTION check_project_json_schema_compliance()
RETURNS trigger AS $$
BEGIN
    -- check if the json data is valid against the schema
    IF NOT EXISTS (
        SELECT 1 
        FROM project_type_schema
        WHERE 
            project_type_schema.id = NEW.schema_id
            AND jsonb_valid_schema(project_type_schema.schema, NEW.data)
    ) THEN
        RAISE EXCEPTION 'JSON schema validation failed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- create the trigger to call the function before insert or update
CREATE TRIGGER json_schema_compliance_trigger
BEFORE INSERT OR UPDATE ON project
FOR EACH ROW EXECUTE FUNCTION check_project_json_schema_compliance();

-- security task system - should probably be moved to a separate database for speed - perhaps sqlite??
-- tasks are tokens that Articleman validates in order to let an action be taken.
-- there is no such thing as a "system" action - everything must be associated with a task id.
-- tasks will have scopes and affected projects/items/entities, when i figure out the architecture.
-- ex: task-<UUID> approved for 
CREATE TABLE "task" (
    "id" char(40) PRIMARY KEY,
    "actor" char(40) NOT NULL REFERENCES "entity"
);

-- COMMIT;
