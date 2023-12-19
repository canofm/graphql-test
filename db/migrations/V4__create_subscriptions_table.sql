CREATE TYPE subscription_status_enum AS ENUM('active', 'paused', 'deactivated');

CREATE TABLE subscriptions(
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "organization_reference" VARCHAR NOT NULL,
  "plan_reference" UUID NOT NULL,
  "status" subscription_status_enum NOT NULL DEFAULT 'active',
  "starts_at" DATE NOT NULL DEFAULT NOW(),
  "ends_at" DATE,
  "billing_frequency" billing_frequency_enum NOT NULL,
  "created_at" DATE NOT NULL DEFAULT NOW(),
  "updated_at" DATE NOT NULL DEFAULT NOW(),
  "deleted_at" DATE,
  FOREIGN KEY(organization_reference) REFERENCES organizations(code),
  FOREIGN KEY(plan_reference) REFERENCES plans(id)
);

create index subscriptions_deleted_at_index on subscriptions(deleted_at);
create index subscriptions_organization_reference_index on subscriptions(organization_reference);
create index subscriptions_plan_reference_index on subscriptions(plan_reference);
