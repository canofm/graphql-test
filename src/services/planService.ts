import GetGraphQLPlanInput from '../models/inputs/getGraphQLPlanInput';
import planRepository from '../repositories/planRepository';
import { Plan } from '../types';

function getPlans(): Promise<Plan[]> {
  return planRepository.getPlans();
}

async function getPlanById(input: GetGraphQLPlanInput): Promise<Plan | undefined> {
  input.validate();
  return planRepository.getPlanById(input.planReference, input.fields);
}

const planService = {
  getPlans,
  getPlanById,
};

export type PlanService = typeof planService;

export default planService;
