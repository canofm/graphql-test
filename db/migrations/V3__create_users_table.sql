CREATE TYPE role_enum AS ENUM('employee', 'admin', 'global_admin');

CREATE TABLE users(
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "email" VARCHAR NOT NULL UNIQUE,
  "organization_reference" VARCHAR NOT NULL,
  "firstname" VARCHAR NOT NULL,
  "lastname" VARCHAR NOT NULL,
  "avatar" VARCHAR,
  "password" VARCHAR NOT NULL,
  "role" role_enum NOT NULL,
  "created_at" DATE NOT NULL DEFAULT NOW(),
  "updated_at" DATE NOT NULL DEFAULT NOW(),
  "deleted_at" DATE,
  FOREIGN KEY(organization_reference) REFERENCES organizations(code)
);

create index users_deleted_at_index on users(deleted_at);
create index users_organization_reference_index on users(organization_reference);
