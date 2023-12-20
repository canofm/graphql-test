import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import * as express from 'express';
import fs from 'fs';
import { Server } from 'http';
import path from 'path';
import resolvers from '../resolvers';
import organizationService, { OrganizationService } from '../services/organizationService';
import planService, { PlanService } from '../services/planService';
import subscriptionService, { SubscriptionService } from '../services/subscriptionService';

type ContextType = {
  planService: PlanService;
  organizationService: OrganizationService;
  subscriptionService: SubscriptionService;
};

const typeDefs = fs.readFileSync(path.join(__dirname, '../schema.graphql')).toString('utf-8');

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
