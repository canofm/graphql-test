import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import * as express from 'express';
import fs from 'fs';
import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';
import { Server } from 'http';
import { pick } from 'lodash';
import path from 'path';
import Db from '../db';
import Subscription from '../models/domain/Subscription';
import { Plan } from '../resolvers-types.generated';
import queryResolver from '../resolvers/queryResolver';
import organizationService, { OrganizationService } from '../services/organizationService';
import planService, { PlanService } from '../services/planService';
import subscriptionService, { SubscriptionService } from '../services/subscriptionService';
import { OrganizationField, PlanField } from '../types';
import { getGraphQLFields } from '../utils/getGraphQLFieldsDb';

type ContextType = {
  db: typeof Db;
  planService: PlanService;
  organizationService: OrganizationService;
  subscriptionService: SubscriptionService;
};

const typeDefs = fs.readFileSync(path.join(__dirname, '../schema.graphql')).toString('utf-8');

const resolvers = {
  Query: queryResolver,
  Plan: {
    customizations: (plan: Plan, _: unknown, __: ContextType, info: GraphQLResolveInfo) => {
      const fields = Object.keys(graphqlFields(info));
      return { ...pick(plan.customizations, fields) };
    },
  },
  Subscription: {
    plan: async (
      subscription: Subscription,
      _: unknown,
      { planService }: ContextType,
      info: GraphQLResolveInfo,
    ) => {
      const fields = getGraphQLFields<PlanField>(info);
      return planService.getPlanById(subscription.planReference, fields);
    },
    organization: async (
      subscription: Subscription,
      _: unknown,
      { organizationService }: ContextType,
      info: GraphQLResolveInfo,
    ) => {
      const fields = getGraphQLFields<OrganizationField>(info);
      return organizationService.getOrganizationByCode(subscription.organizationReference, fields);
    },
    lastPaymentDateAt: async (subscription: Subscription, __: unknown, { db }: ContextType) => {
      const [r] = await db
        .from('payments as p')
        .select('p.updated_at')
        .join(
          db
            .from('invoices as i')
            .limit(1)
            .where('i.organization_reference', subscription.organizationReference)
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
      planService,
      subscriptionService,
      organizationService,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();
  server.applyMiddleware({ app });
  return server;
}
