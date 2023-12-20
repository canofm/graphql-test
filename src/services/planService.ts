import planRepository from '../repositories/planRepository';
import { Plan, PlanField } from '../types';

function getPlans(): Promise<Plan[]> {
  return planRepository.getPlans();
}

async function getPlanById(planId: Plan['id'], fields?: PlanField[]): Promise<Plan | undefined> {
  return planRepository.getPlanById(planId, fields ?? []);
}

const planService = {
  getPlans,
  getPlanById,
};

export type PlanService = typeof planService;

export default planService;
