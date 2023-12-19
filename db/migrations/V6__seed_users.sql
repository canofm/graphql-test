INSERT INTO users(email, organization_reference, firstname, lastname, password, role)
VALUES
  ('kfernandez@yuno.com', (SELECT org.id FROM organizations org WHERE org.code = 'yuno_col'), 'Kasey', 'Fernandez', 'aPlainPassword1234','admin'),
  ('bhess@revelo.com', (SELECT org.id FROM organizations org WHERE org.code = 'revelo_bra'), 'Bruce', 'Hess', 'aPlainPassword1234','admin'),
  ('eyates@foodinthebox.com', (SELECT org.id FROM organizations org WHERE org.code = 'foodinthebox_esp'), 'Eden', 'Yates', 'aPlainPassword1234','admin');
