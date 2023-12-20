import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';

export function getGraphQLFields<T>(params: GraphQLResolveInfo): T[] {
  return Object.keys(graphqlFields(params)) as unknown as T[];
}
