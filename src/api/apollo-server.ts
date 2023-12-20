import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import * as express from 'express';
import fs from 'fs';
import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';
import { Server } from 'http';
import { pick, snakeCase } from 'lodash';
import path from 'path';
import Db from '../db';
import { BillingFrequency, Plan, SubscriptionStatus } from '../resolvers-types.generated';

type ContextType = { db: typeof Db };

const typeDefs = fs.readFileSync(path.join(__dirname, '../schema.graphql')).toString('utf-8');

type SubscriptionDb = {
  id: string;
  organization_reference: string;
  plan_reference: string;
  status: SubscriptionStatus;
  starts_at: Date;
  ends_at?: Date | null;
  billing_frequency: BillingFrequency;
};

const resolvers = {
  Query: {
    plans: async (_: unknown, __: unknown, { db }: { db: typeof Db }, ___: unknown) => {
      return db('plans').select();
    },
    subscriptions: async (_: unknown, __: unknown, { db }: ContextType, ___: unknown) => {
      return db('subscriptions').select();
    },
  },
  Plan: {
    customizations: (plan: Plan, _: unknown, __: ContextType, info: GraphQLResolveInfo) => {
      const fields = Object.keys(graphqlFields(info));
      return { ...pick(plan.customizations, fields) };
    },
  },
  Subscription: {
    plan: async (
      subscription: SubscriptionDb,
      _: unknown,
      { db }: ContextType,
      info: GraphQLResolveInfo,
    ) => {
      const fields = Object.keys(graphqlFields(info)).map(snakeCase);
      const [p] = await db('plans').select(fields).where('id', subscription.plan_reference);
      return p;
    },
    organization: async (
      subscription: SubscriptionDb,
      _: unknown,
      { db }: ContextType,
      info: GraphQLResolveInfo,
    ) => {
      const fields = Object.keys(graphqlFields(info)).map(snakeCase);
      const [p] = await db('organizations')
        .select(fields)
        .where('code', subscription.organization_reference);
      return p;
    },
    billingFrequency: (subscription: SubscriptionDb) => {
      return subscription.billing_frequency;
    },
    startsAt: (subscription: SubscriptionDb) => {
      return new Date(subscription.starts_at).toISOString();
    },
    endsAt: (subscription: SubscriptionDb) => {
      return subscription.ends_at ? new Date(subscription.ends_at).toISOString() : null;
    },
    lastPaymentDateAt: async (subscription: SubscriptionDb, __: unknown, { db }: ContextType) => {
      const [r] = await db
        .from('payments as p')
        .select('p.updated_at')
        .join(
          db
            .from('invoices as i')
            .limit(1)
            .where('i.organization_reference', subscription.organization_reference)
            .andWhere('i.subscription_reference', subscription.id)
            .andWhere('i.status', 'paid')
            .orderBy('i.updated_at', 'desc')
            .as('r'),
          'p.invoice_reference',
          'r.id',
        );
      return new Date(r.updated_at).toISOString();
    },
    nextPaymentDateAt: () => {
      return new Date().toISOString();
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
