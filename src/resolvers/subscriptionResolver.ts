import { GraphQLResolveInfo } from 'graphql';
import Organization from '../models/domain/Organization';
import Plan from '../models/domain/Plan';
import Subscription from '../models/domain/Subscription';
import { getGraphQLFields } from '../utils/getGraphQLFieldsDb';
import { ContextResolver } from './types';

const subscriptionResolver = {
  plan: async (
    subscription: Subscription,
    _: unknown,
    { planService }: ContextResolver,
    info: GraphQLResolveInfo,
  ) => {
    const fields = getGraphQLFields<keyof Plan>(info);
    return planService.getPlanById(subscription.planReference, fields);
  },
  organization: async (
    subscription: Subscription,
    _: unknown,
    { organizationService }: ContextResolver,
    info: GraphQLResolveInfo,
  ) => {
    const fields = getGraphQLFields<keyof Organization>(info);
    return organizationService.getOrganizationByCode(subscription.organizationReference, fields);
  },
  lastPaymentDateAt: async (
    subscription: Subscription,
    __: unknown,
    { subscriptionService }: ContextResolver,
  ) => {
    const lastPaymentDate = await subscriptionService.getLastPaymentDate(
      subscription.organizationReference,
      subscription.id,
    );
    return lastPaymentDate?.toISOString();
  },
  nextPaymentDateAt: async (
    subcription: Subscription,
    _: unknown,
    { subscriptionService }: ContextResolver,
  ) => {
    const nextPaymentDate = await subscriptionService.getNextPaymentDate(subcription);
    return nextPaymentDate.toISOString();
  },
};

export default subscriptionResolver;
