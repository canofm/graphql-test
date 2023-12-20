import { pick } from 'lodash';
import Organization from '../models/domain/Organization';
import organizationRepository from '../repositories/organizationRepository';

async function getOrganizationByCode(
  organizationCode: Organization['code'],
  fields?: (keyof Organization)[],
): Promise<Organization | undefined> {
  const organization = await organizationRepository.getOrganizationByCode(organizationCode);
  if (!organization) {
    throw new Error(`Organization with code ${organizationCode} not found`);
  }
  return fields ? pick(organization, fields) : organization;
}

const organizationService = {
  getOrganizationByCode,
};

export type OrganizationService = typeof organizationService;

export default organizationService;
