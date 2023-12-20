import { snakeCase } from 'lodash';
import db from '../db';
import { CountryCode, Organization, OrganizationField } from '../types';
import convertObjectKeysToCamelCase from '../utils/convertObjectKeysToCamelCase';

type OrganizationDb = {
  id: string;
  code: string;
  name: string;
  country_code: CountryCode;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

function mapOrganization(organization: OrganizationDb): Organization {
  return convertObjectKeysToCamelCase(organization);
}

async function getOrganizationByCode(
  code: string,
  fields: OrganizationField[],
): Promise<Organization | undefined> {
  const dbFields = fields.map((field: OrganizationField) => snakeCase(field));
  const [firstResult] = (await db<OrganizationDb>('organizations')
    .select(dbFields)
    .where('code', code)) as unknown as OrganizationDb[];
  return mapOrganization(firstResult);
}

const organizationRepository = { getOrganizationByCode };
export type OrganizationRepository = typeof organizationRepository;

export default organizationRepository;
