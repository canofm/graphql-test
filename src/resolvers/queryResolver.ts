import { ContextResolver } from '.';
import { Plan, QueryResolvers } from '../resolvers-types.generated';

const queryResolver: QueryResolvers<ContextResolver> = {
  plans: (_: unknown, __: unknown, { planService }: ContextResolver) => {
    return planService.getPlans() as unknown as Promise<Plan[]>; // TODO: Revisar
    // mapToResolver()
  },
  subscriptions: (_: unknown, __: unknown, { db }: ContextResolver) => {
    return db('subscriptions').select();
  },
};

export default queryResolver;
