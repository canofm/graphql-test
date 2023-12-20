import db from '../db';
import Plan from '../models/domain/Plan';
import { PlanDb } from '../types';

async function getPlans(): Promise<Plan[]> {
  const plansDb = await db.from('plans').select();
  return plansDb.map((plan: PlanDb) => Plan.fromDb(plan));
}

async function getPlanById(id: string): Promise<Plan | undefined> {
  const [firstResult] = await db<PlanDb>('plans').select().where('id', id);
  return Plan.fromDb(firstResult);
}

const planRepository = { getPlans, getPlanById };
export type PlanRepository = typeof planRepository;

export default planRepository;
