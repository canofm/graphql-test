import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { createApolloServer } from './apollo-server';
import db from '../db';

const { APP_PORT: PORT } = process.env;

const app = express();

async function main() {
  const httpServer = createServer(app);
  const apolloServer = await createApolloServer(db, httpServer, app);

  await new Promise<void>((resolve) =>
    app.listen(PORT, () => {
      console.log(`App listening on port: ${PORT}/${apolloServer.graphqlPath}`);
      resolve();
    }),
  );
}

main().catch((err) => {
  console.error(err);
});
