import express, { Request, Response } from 'express';
import { Client } from 'pg';
import 'dotenv/config';

const {
  APP_PORT: appPort,
  POSTGRES_DB: dbName,
  POSTGRES_USER: dbUser,
  POSTGRES_PASSWORD: dbPassword,
  POSTGRES_HOST: dbHost,
} = process.env;

const app = express();
const port = appPort;

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello world!');
});

const client = new Client({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: 5432,
});

client.connect();
client.query('SELECT NOW()', (err, res) => {
  console.log('Error or response: ', err, res);
  client.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
