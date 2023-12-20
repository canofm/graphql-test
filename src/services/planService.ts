import { pick } from 'lodash';
import Plan from '../models/domain/Plan';
import planRepository from '../repositories/planRepository';

type PlanField = keyof Plan;
function getPlans(): Promise<Plan[]> {
  return planRepository.getPlans();
}

async function getPlanById(planId: Plan['id'], fields?: PlanField[]): Promise<Plan | undefined> {
  const plan = await planRepository.getPlanById(planId);
  if (!plan) {
    throw new Error(`Plan with id ${planId} not found`);
  }
  return fields ? pick(plan, fields) : plan;
}

const planService = {
  getPlans,
  getPlanById,
};

export type PlanService = typeof planService;

export default planService;
