CREATE EXTENSION pg_jsonschema;

/* any char(40) types are UUIDv7s with a three-character prefix,
   matching their use. ex: "org-[UUID]", "ent-[uuid]"
   there's no real reason for this other than easy differentiation,
   and extra assurance that between different parts of Articleman, there
   won't be any UUID collisions. it's basically a namespace. */


/* Create the Bill Recipients table.
   All payment is handled by external systems like Lago,
   or even stripe billing, too big of a security risk for us. */
CREATE TYPE "billing_status" AS ENUM (
    'none', -- hasn't set up billing at all
    'complimentary', -- was manually given special free status
    'trial', -- is in a trial mode and has not paid yet
    'active', -- is able to receive and pay invoices
    'grace_period', -- failed to pay invoices but still has time to do so
    'bad_standing', -- entity is repeatedly failing to pay invoices
    'ended', -- has stopped paying for subscriptions and must re-activate
    'dead' -- entity can't be billed anymore and will be culled on opportunity
);

CREATE TABLE "bill_recipient" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "iso_country" char(3) NOT NULL,
    -- id for external payment gateway
    "gateway_id" char(40) NOT NULL,
    -- is the account in good standing / should it be treated as a trial, etc.
    "status" billing_status NOT NULL,
    "settings" jsonb
);

CREATE TYPE "organization_transparency_status" AS ENUM (
    'open', /* all entities in the organization can view overviews of sibling
    orgs and the parent org, even if they don't have write access */
    'liaison', /* managing entities can view overviews of parent + sibling orgs
    without write access */
    'closed' /* no org members can interact with anything outside of the
    organization without explicit access */
);

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
    "org" char(40) NOT NULL REFERENCES organization,
    "type" entity_class NOT NULL,
    "person_id" char(40),
    "group_id" char(40),
    "machine_id" char(40),
    CONSTRAINT check_existence CHECK (
        num_nonnulls("person_id", "group_id", "machine_id") = 1
    )
);


ALTER TABLE "organization" ADD CONSTRAINT "fk_manent" FOREIGN KEY (
    "managing_entity"
) REFERENCES "entity";

CREATE TABLE "person" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "entity_id" char(40) NOT NULL REFERENCES "entity",
    "settings" jsonb
);

CREATE TABLE "group" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "entity_id" char(40) NOT NULL REFERENCES "entity",
    "name" varchar(255),
    "settings" jsonb
);

CREATE TABLE "group_membership" (
    "group_id" char(40) NOT NULL REFERENCES "group",
    "entity_id" char(40) NOT NULL PRIMARY KEY REFERENCES "entity"
);

CREATE TABLE "machine" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "entity_id" char(40) NOT NULL REFERENCES entity,
    "name" varchar(255),
    "settings" jsonb
);

CREATE TABLE "account" (
    "id" char(40) NOT NULL PRIMARY KEY,
    "idm_id" char(40) NOT NULL
);

ALTER TABLE entity ADD CONSTRAINT "fk_pid" FOREIGN KEY (
    "person_id"
) REFERENCES "person";
ALTER TABLE entity ADD CONSTRAINT "fk_gid" FOREIGN KEY (
    "group_id"
) REFERENCES "person";
ALTER TABLE entity ADD CONSTRAINT "fk_mid" FOREIGN KEY (
    "machine_id"
) REFERENCES "person";

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
