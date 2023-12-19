INSERT INTO plans(name, monthly_price, currency, billing_frequency, storage_amount, storage_unit, support_level, customizations, annual_discount)
VALUES
  ('Basic Plan', 9.99, 'usd', 'monthly', 10, 'GB', 'basic', '{}', 10),
  ('Pro Plan', 19.99, 'usd', 'monthly', 50, 'GB', 'priority', '{ "analytics tools": true }', 15),
  ('Enterprise Plan', 49.99, 'usd', 'monthly', null, null, 'dedicated', '{ "advanced analytics": true, "custom integrations": true }', 20);
