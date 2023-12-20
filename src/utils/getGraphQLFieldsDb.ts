import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';
import { snakeCase } from 'lodash';

export function getGraphQLFieldsDb<T>(params: GraphQLResolveInfo): T[] {
  return Object.keys(graphqlFields(params)).map(snakeCase) as unknown as T[];
}

export function getGraphQLFields<T>(params: GraphQLResolveInfo): T[] {
  return Object.keys(graphqlFields(params)) as unknown as T[];
}
