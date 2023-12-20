import { QueryResolvers } from '../resolvers-types.generated';
import { ContextResolver } from './types';

const queryResolver = {
  plans: (_: unknown, __: unknown, { planService }: ContextResolver) => {
    return planService.getPlans();
  },
  subscriptions: (_: unknown, __: unknown, { subscriptionService }: ContextResolver) => {
    return subscriptionService.getSubscriptions();
  },
};

export default queryResolver;
