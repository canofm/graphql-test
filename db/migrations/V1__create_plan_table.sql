CREATE TYPE currency_enum AS ENUM('usd', 'peso_argentino');
CREATE TYPE billing_frequency_enum AS ENUM('monthly', 'annual');
CREATE TYPE storage_unit_enum AS ENUM('GB', 'TB');
CREATE TYPE support_level_enum AS ENUM('basic', 'priority', 'dedicated');

CREATE TABLE plans(
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "name" VARCHAR NOT NULL,
  "description" TEXT,
  "monthly_price" DECIMAL NOT NULL,
  "currency" currency_enum NOT NULL,
  "billing_frequency" billing_frequency_enum NOT NULL,
  "storage_amount" integer,
  "storage_unit" storage_unit_enum,
  "support_level" support_level_enum NOT NULL,
  "customizations" JSONB NOT NULL DEFAULT '{}',
  "annual_discount" DECIMAL,
  "created_at" DATE NOT NULL DEFAULT NOW(),
  "updated_at" DATE NOT NULL DEFAULT NOW(),
  "deleted_at" DATE
);

create index plans_customizations_gin_index on plans using gin (customizations);
create index plans_deleted_at_index on plans(deleted_at);
