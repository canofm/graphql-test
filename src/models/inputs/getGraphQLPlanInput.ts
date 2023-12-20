import { GraphQLResolveInfo } from 'graphql';
import { Input } from '.';
import { PlanField, PLAN_FIELDS } from '../../types';
import { getGraphQLFields } from '../../utils/getGraphQLFieldsDb';

class GetGraphQLPlanInput implements Input {
  public planReference: string;

  public fields: PlanField[];

  constructor(planReference: string, info: GraphQLResolveInfo) {
    this.planReference = planReference;
    this.fields = getGraphQLFields(info);
  }

  validate(): void {
    if (!this.fields.every((field: PlanField) => PLAN_FIELDS.includes(field))) {
      throw new Error(`One or more fields are invalid: ${this.fields}`);
    }
  }
}

export default GetGraphQLPlanInput;
