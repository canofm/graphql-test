import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import * as express from 'express';
import fs from 'fs';
import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';
import { Server } from 'http';
import { pick } from 'lodash';
import path from 'path';
import Subscription from '../models/domain/Subscription';
import { Plan } from '../resolvers-types.generated';
import queryResolver from '../resolvers/queryResolver';
import organizationService, { OrganizationService } from '../services/organizationService';
import planService, { PlanService } from '../services/planService';
import subscriptionService, { SubscriptionService } from '../services/subscriptionService';
import { OrganizationField, PlanField } from '../types';
import { getGraphQLFields } from '../utils/getGraphQLFieldsDb';

type ContextType = {
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
    lastPaymentDateAt: async (
      subscription: Subscription,
      __: unknown,
      { subscriptionService }: ContextType,
    ) => {
      const lastPaymentDate = await subscriptionService.getLastPaymentDate(
        subscription.organizationReference,
        subscription.id,
      );
      return lastPaymentDate.toISOString();
    },
    nextPaymentDateAt: async (
      subcription: Subscription,
      _: unknown,
      { subscriptionService }: ContextType,
    ) => {
      const nextPaymentDate = await subscriptionService.getNextPaymentDate(subcription);
      return nextPaymentDate.toISOString();
    },
  },
};

export async function createApolloServer(
  httpServer: Server,
  app: express.Application,
): Promise<ApolloServer<ExpressContext>> {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: (): ContextType => ({
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
