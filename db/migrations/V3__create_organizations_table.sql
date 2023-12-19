CREATE TYPE country_code_enum AS ENUM('arg', 'bra', 'chl', 'col', 'per', 'mex', 'esp', 'usa');

CREATE TABLE organizations(
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "code" VARCHAR NOT NULL UNIQUE,
  "name" VARCHAR NOT NULL,
  "country_code" country_code_enum NOT NULL,
  "created_at" DATE NOT NULL DEFAULT NOW(),
  "updated_at" DATE NOT NULL DEFAULT NOW(),
  "deleted_at" DATE
);

create index organizations_deleted_at_index on organizations(deleted_at);
