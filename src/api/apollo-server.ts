import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import * as express from 'express';
import { Server } from 'http';
import Db from '../db';
import { gql } from 'apollo-server-core';

const typeDefs = gql`
  enum Currency {
    usd
    peso
    argentino
  }

  enum BillingFrequency {
    monthly
    annual
  }

  enum StorageUnit {
    GB
    TB
  }

  enum SupportLevel {
    basic
    priority
    dedicated
  }

  type Plan {
    id: ID!
    name: String!
    description: String
    monthlyPrice: Float!
    currency: Currency!
    billingFrequency: BillingFrequency!
    storageAmount: Int
    storageUnit: StorageUnit
    supportLevel: SupportLevel!
    annualDiscount: Float!
  }

  type Query {
    plans: [Plan]!
  }
`;

const resolvers = {
  Query: {
    plans: (_: unknown, __: unknown, { db }: { db: typeof Db }) => {
      return db('plans').select();
    },
  },
};

export async function createApolloServer(
  db: typeof Db,
  httpServer: Server,
  app: express.Application,
): Promise<ApolloServer<ExpressContext>> {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: (): { db: typeof Db } => ({
      db,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  return server;
}
