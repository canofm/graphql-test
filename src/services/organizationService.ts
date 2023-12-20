import GetGraphQLOrganizationInput from '../models/inputs/getGraphQLOrganizationInput';
import organizationRepository from '../repositories/organizationRepository';
import { Organization } from '../types';

async function getOrganizationByCode(
  input: GetGraphQLOrganizationInput,
): Promise<Organization | undefined> {
  input.validate();
  return organizationRepository.getOrganizationByCode(input.organizationReference, input.fields);
}

const organizationService = {
  getPlanById: getOrganizationByCode,
};

export type OrganizationService = typeof organizationService;

export default organizationService;
