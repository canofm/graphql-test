import 'dotenv/config';
import knex from 'knex';

const {
  POSTGRES_DB: dbName,
  POSTGRES_USER: dbUser,
  POSTGRES_PASSWORD: dbPassword,
  DB_HOST: dbHost,
} = process.env;

export default knex({
  client: 'pg',
  connection: {
    host: dbHost,
    port: 5432,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  },
});
