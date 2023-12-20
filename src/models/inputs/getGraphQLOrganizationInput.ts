import { GraphQLResolveInfo } from 'graphql';
import { Input } from '.';
import { OrganizationField, ORGANIZATIONS_FIELDS } from '../../types';
import { getGraphQLFields } from '../../utils/getGraphQLFieldsDb';

class GetGraphQLOrganizationInput implements Input {
  public organizationReference: string;

  public fields: OrganizationField[];

  constructor(planReference: string, info: GraphQLResolveInfo) {
    this.organizationReference = planReference;
    this.fields = getGraphQLFields(info);
  }

  validate(): void {
    if (!this.fields.every((field: OrganizationField) => ORGANIZATIONS_FIELDS.includes(field))) {
      throw new Error(`One or more fields are invalid: ${this.fields}`);
    }
  }
}

export default GetGraphQLOrganizationInput;
