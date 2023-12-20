import db from '../db';
import Organization from '../models/domain/Organization';
import { OrganizationDb } from '../types';

type OrganizationField = keyof Organization;

async function getOrganizationByCode(code: string): Promise<Organization | undefined> {
  const [firstResult] = (await db<OrganizationDb>('organizations')
    .select()
    .where('code', code)) as unknown as OrganizationDb[];
  return Organization.fromDb(firstResult);
}

const organizationRepository = { getOrganizationByCode };
export type OrganizationRepository = typeof organizationRepository;

export default organizationRepository;
