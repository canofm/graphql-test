import { camelCase, mapKeys } from 'lodash';

export default function convertObjectKeysToCamelCase<T extends Record<string, unknown>>(o: T): T {
  return mapKeys(o, (v: unknown, k: string) => camelCase(k)) as unknown as T;
}
