INSERT INTO plans(name, monthly_price, currency, billing_frequency, storage_amount, storage_unit, support_level, customizations, annual_discount)
VALUES
  ('Basic Plan', 9.99, 'usd', 'monthly', 10, 'GB', 'basic', '{}', 10),
  ('Pro Plan', 19.99, 'usd', 'monthly', 50, 'GB', 'priority', '{ "analytics_tools": true }', 15),
  ('Enterprise Plan', 49.99, 'usd', 'monthly', null, null, 'dedicated', '{ "advanced_analytics": true, "custom_integrations": true }', 20);

INSERT INTO organizations(name, code, country_code)
VALUES
  ('yuno','yuno_col', 'col'),
  ('revelo','revelo_bra', 'bra'),
  ('foodinthebox','foodinthebox_esp', 'esp'),
  ('atlas', 'atlas', 'arg');

INSERT INTO users(email, organization_reference, firstname, lastname, password, role)
VALUES
  ('kfernandez@yuno.com', 'yuno_col', 'Kasey', 'Fernandez', 'aPlainPassword1234','admin'),
  ('bhess@revelo.com', 'revelo_bra', 'Bruce', 'Hess', 'aPlainPassword1234','admin'),
  ('eyates@foodinthebox.com', 'foodinthebox_esp', 'Eden', 'Yates', 'aPlainPassword1234','admin'),
  ('aroberts@heyatlas.com', 'atlas', 'Ariana', 'Roberts', '4321nimda', 'global_admin');

INSERT INTO subscriptions(organization_reference, plan_reference, status, starts_at, ends_at, billing_frequency)
VALUES
  ('yuno_col', (SELECT plan.id FROM plans plan WHERE plan.name = 'Basic Plan'), 'active', '01-01-2023'::date, '01-01-2024'::date, 'monthly'),
  ('revelo_bra', (SELECT plan.id FROM plans plan WHERE plan.name = 'Pro Plan'), 'active', '02-15-2023'::date, null, 'monthly'),
  ('foodinthebox_esp', (SELECT plan.id FROM plans plan WHERE plan.name = 'Enterprise Plan'), 'paused', '01-20-2023'::date, null, 'annual');

INSERT INTO invoices(organization_reference, subscription_reference, status, amount, currency, updated_by, due_date_at, billing_address, billing_country_code, billing_zip_code, billing_full_name)
VALUES
  ('yuno_col', (SELECT subs.id FROM subscriptions subs WHERE organization_reference = 'yuno_col'), 'paid', 9.99, 'usd', (SELECT u.id FROM users u WHERE u.organization_reference = 'yuno_col'), '03-01-2023'::date, 'calle falsa 1234 piso 5, depto. B', 'col', '578986', 'Kasey Fernandez'),
  ('yuno_col', (SELECT subs.id FROM subscriptions subs WHERE organization_reference = 'yuno_col'), 'open', 9.99, 'usd', (SELECT u.id FROM users u WHERE u.role = 'global_admin'), '04-01-2023'::date, null, null, null, null),
  ('revelo_bra', (SELECT subs.id FROM subscriptions subs WHERE organization_reference = 'revelo_bra'), 'paid', 19.99, 'usd', (SELECT u.id FROM users u WHERE u.organization_reference = 'revelo_bra'), '03-15-2023'::date, 'otra calle falsa 1234 piso 1, depto. C', 'bra', '13100-200', 'Bruce Hess'),
  ('revelo_bra', (SELECT subs.id FROM subscriptions subs WHERE organization_reference = 'revelo_bra'), 'open', 19.99, 'usd', (SELECT u.id FROM users u WHERE u.role = 'global_admin'), '04-15-2023'::date, null, null, null, null),
  ('foodinthebox_esp', (SELECT subs.id FROM subscriptions subs WHERE organization_reference = 'foodinthebox_esp'), 'paid', 49.99, 'usd', (SELECT u.id FROM users u WHERE u.organization_reference = 'foodinthebox_esp'), '01-20-2023'::date, 'y otra calle falsa 1234 piso 2, depto. F', 'esp', '37640', 'Eden Yates'),
  ('foodinthebox_esp', (SELECT subs.id FROM subscriptions subs WHERE organization_reference = 'foodinthebox_esp'), 'draft', 49.99, 'usd', (SELECT u.id FROM users u WHERE u.role = 'global_admin'), '01-20-2024'::date, null, null, null, null);

INSERT INTO payments(organization_reference, invoice_reference, status, amount, currency, payment_method)
VALUES
  ('yuno_col', (SELECT inv.id FROM invoices inv WHERE (inv.organization_reference = 'yuno_col' and inv.status = 'paid')), 'approved', 9.99, 'usd', 'credit_card'),
  ('revelo_bra', (SELECT inv.id FROM invoices inv WHERE (inv.organization_reference = 'revelo_bra' and inv.status = 'paid')), 'approved', 19.99, 'usd', 'debit_card'),
  ('foodinthebox_esp', (SELECT inv.id FROM invoices inv WHERE (inv.organization_reference = 'foodinthebox_esp' and inv.status = 'paid')), 'approved', 49.99, 'usd', 'bank_transfer');
