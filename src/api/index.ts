import express, { Request, Response } from 'express';
import knex from 'knex';
import 'dotenv/config';

const {
  APP_PORT: appPort,
  POSTGRES_DB: dbName,
  POSTGRES_USER: dbUser,
  POSTGRES_PASSWORD: dbPassword,
  DB_HOST: dbHost,
} = process.env;

const app = express();
const port = appPort;

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello world!');
});

const x = knex({
  client: 'pg',
  connection: {
    host: dbHost,
    port: 5432,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  },
});

x.raw('select now()').then(({ rows }) => console.log({ rows }));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
