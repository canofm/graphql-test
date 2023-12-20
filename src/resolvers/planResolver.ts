import { GraphQLResolveInfo } from 'graphql';
import { pick } from 'lodash';
import { Plan } from '../resolvers-types.generated';
import { getGraphQLFields } from '../utils/getGraphQLFieldsDb';
import { ContextResolver } from './types';

const planResolver = {
  customizations: (plan: Plan, _: unknown, __: ContextResolver, info: GraphQLResolveInfo) => {
    const fields = getGraphQLFields<keyof Plan>(info);
    return { ...pick(plan.customizations, fields) };
  },
};

export default planResolver;
