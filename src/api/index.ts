import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Cache } from '../cache';
import { createApolloServer } from './apollo-server';

const { APP_PORT: PORT } = process.env;

const app = express();

async function main() {
  const httpServer = createServer(app);
  const apolloServer = await createApolloServer(httpServer, app);

  try {
    const cache = new Cache();
    await cache.connect();
    console.log('cache.connected');
  } catch (error: unknown) {
    console.log('cache.failed_to_connect');
    console.error(error);
  }

  await new Promise<void>((resolve) =>
    app.listen(PORT, () => {
      console.log(`App listening on http://localhost:${PORT}${apolloServer.graphqlPath}`);
      resolve();
    }),
  );
}

main().catch((err) => {
  console.error(err);
});
