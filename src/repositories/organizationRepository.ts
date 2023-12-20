import { snakeCase } from 'lodash';
import db from '../db';
import Organization from '../models/domain/Organization';
import { OrganizationDb, OrganizationField } from '../types';

async function getOrganizationByCode(
  code: string,
  fields: OrganizationField[],
): Promise<Organization | undefined> {
  const dbFields = fields.map((field: OrganizationField) => snakeCase(field));
  const [firstResult] = (await db<OrganizationDb>('organizations')
    .select(dbFields)
    .where('code', code)) as unknown as OrganizationDb[];
  return Organization.fromDb(firstResult);
}

const organizationRepository = { getOrganizationByCode };
export type OrganizationRepository = typeof organizationRepository;

export default organizationRepository;
