import organizationRepository from '../repositories/organizationRepository';
import { Organization, OrganizationField } from '../types';

async function getOrganizationByCode(
  organizationCode: Organization['code'],
  fields?: OrganizationField[],
): Promise<Organization | undefined> {
  return organizationRepository.getOrganizationByCode(organizationCode, fields ?? []);
}

const organizationService = {
  getOrganizationByCode,
};

export type OrganizationService = typeof organizationService;

export default organizationService;
