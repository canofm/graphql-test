import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import * as express from 'express';
import fs from 'fs';
import { GraphQLResolveInfo } from 'graphql';
import { Server } from 'http';
import { pick } from 'lodash';
import path from 'path';
import Db from '../db';
import planRepository, { PlanDb, PlanFields, PlanRepository } from '../repositories/planRepository';
import { SubscriptionStatus } from '../resolvers-types.generated';
import { BillingFrequency } from '../types';
import convertObjectKeysToCamelCase from '../utils/convertObjectKeysToCamelCase';
import { getGraphQLFieldsDb } from '../utils/getGraphQLFieldsDb';

type ContextType = { db: typeof Db; planRepository: PlanRepository };

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
    plans: (_: unknown, __: unknown, { planRepository }: ContextType, ___: unknown) => {
      return planRepository.getPlans();
    },
    subscriptions: async (_: unknown, __: unknown, { db }: ContextType, ___: unknown) => {
      return db('subscriptions').select();
    },
  },
  Plan: {
    customizations: (plan: PlanDb, _: unknown, __: ContextType, info: GraphQLResolveInfo) => {
      const fields = getGraphQLFieldsDb<PlanFields>(info);
      return { ...pick(convertObjectKeysToCamelCase<PlanDb>(plan).customizations, fields) };
    },
  },
  Subscription: {
    plan: (
      subscription: SubscriptionDb,
      _: unknown,
      { planRepository }: ContextType,
      info: GraphQLResolveInfo,
    ) => {
      const fields = getGraphQLFieldsDb<PlanFields>(info);
      return planRepository.getPlanById(subscription.plan_reference, fields);
    },
    organization: async (
      subscription: SubscriptionDb,
      _: unknown,
      { db }: ContextType,
      info: GraphQLResolveInfo,
    ) => {
      const fields = getGraphQLFieldsDb(info);
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
    context: (): ContextType => ({
      db,
      planRepository,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  return server;
}
