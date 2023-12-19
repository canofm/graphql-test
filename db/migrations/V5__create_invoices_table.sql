CREATE TYPE invoice_status_enum AS ENUM('draft', 'open', 'paid', 'canceled', 'uncollectible');

CREATE TABLE invoices(
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "organization_reference" VARCHAR NOT NULL,
  "subscription_reference" UUID NOT NULL,
  "status" invoice_status_enum NOT NULL DEFAULT 'draft',
  "amount" DECIMAL NOT NULL,
  "currency" currency_enum NOT NULL,
  "updated_by" UUID NOT NULL,
  "due_date_at" DATE NOT NULL,
  "billing_address" VARCHAR,
  "billing_zip_code" VARCHAR,
  "billing_country_code" country_code_enum,
  "billing_full_name" VARCHAR,
  "created_at" DATE NOT NULL DEFAULT NOW(),
  "updated_at" DATE NOT NULL DEFAULT NOW(),
  "deleted_at" DATE,
  FOREIGN KEY(organization_reference) REFERENCES organizations(code),
  FOREIGN KEY(subscription_reference) REFERENCES subscriptions(id),
  FOREIGN KEY(updated_by) REFERENCES users(id)
);

create index invoices_deleted_at_index on invoices(deleted_at);
create index invoices_organization_reference_index on invoices(organization_reference);
create index invoices_subscription_reference_index on invoices(subscription_reference);
