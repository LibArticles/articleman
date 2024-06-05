DROP EXTENSION IF EXISTS pg_jsonschema;

DROP TYPE IF EXISTS "billing_status";

DROP TABLE IF EXISTS "bill_recipient";

DROP TYPE IF EXISTS "organization_transparency_status";

DROP TABLE IF EXISTS "organization";

DROP TYPE IF EXISTS "entity_class";

DROP TABLE IF EXISTS "entity";

DROP TABLE IF EXISTS "person";

DROP TABLE IF EXISTS "group";

DROP TABLE IF EXISTS "group_membership";

DROP TABLE IF EXISTS "machine";

DROP TABLE IF EXISTS "account";

DROP FUNCTION IF EXISTS check_json_schema_validity;

-- Schema
DROP TABLE IF EXISTS "project_type_schema";

-- create the trigger to call the function before insert or update
DROP TRIGGER IF EXISTS json_schema_validation_trigger;

-- for custom project types
DROP TABLE IF EXISTS "project_type";

DROP TABLE IF EXISTS "project";

-- create the function to check json schema compliance
DROP FUNCTION IF EXISTS check_project_json_schema_compliance;

-- create the trigger to call the function before insert or update
DROP TRIGGER IF EXISTS json_schema_compliance_trigger;
