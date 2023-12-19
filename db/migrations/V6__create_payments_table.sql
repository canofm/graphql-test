CREATE TYPE payment_status_enum AS ENUM('pending', 'processing', 'approved', 'rejected');
CREATE TYPE payment_method_enum AS ENUM('credit_card', 'debit_card', 'bank_transfer');

CREATE TABLE payments(
  "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  "organization_reference" VARCHAR NOT NULL,
  "invoice_reference" UUID NOT NULL,
  "status" payment_status_enum NOT NULL DEFAULT 'pending',
  "amount" DECIMAL NOT NULL,
  "currency" currency_enum NOT NULL,
  "payment_method" payment_method_enum NOT NULL,
  "created_at" DATE NOT NULL DEFAULT NOW(),
  "updated_at" DATE NOT NULL DEFAULT NOW(),
  "deleted_at" DATE,
  FOREIGN KEY(organization_reference) REFERENCES organizations(code),
  FOREIGN KEY(invoice_reference) REFERENCES invoices(id)
);

create index payments_deleted_at_index on payments(deleted_at);
create index payments_organization_reference_index on payments(organization_reference);
create index payments_invoice_reference_index on payments(invoice_reference);
