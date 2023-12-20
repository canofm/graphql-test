import { snakeCase } from 'lodash';
import db from '../db';
import Plan from '../models/domain/Plan';
import { PlanDb, PlanField } from '../types';

async function getPlans(): Promise<Plan[]> {
  const plansDb = await db.from('plans').select();
  return plansDb.map((plan: PlanDb) => Plan.fromDb(plan));
}

async function getPlanById(id: string, fields: PlanField[]): Promise<Plan | undefined> {
  const dbFields = fields.map((field: PlanField) => snakeCase(field));
  const [firstResult] = (await db<PlanDb>('plans')
    .select(dbFields)
    .where('id', id)) as unknown as PlanDb[];
  return Plan.fromDb(firstResult);
}

const planRepository = { getPlans, getPlanById };
export type PlanRepository = typeof planRepository;

export default planRepository;
