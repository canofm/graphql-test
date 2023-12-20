import { snakeCase } from 'lodash';
import db from '../db';
import { SupportLevel } from '../resolvers-types.generated';
import { BillingFrequency, Currency, Customizations, Plan, PlanField, StorageUnit } from '../types';
import convertObjectKeysToCamelCase from '../utils/convertObjectKeysToCamelCase';

type CustomizationsDb = {
  advanced_analytics?: boolean | null;
  analytics_tools?: boolean | null;
  custom_integrations?: boolean | null;
};

export type PlanDb = {
  id: string;
  name: string;
  description: string | null;
  monthly_price: number;
  currency: Currency;
  billing_frequency: BillingFrequency;
  storage_amount: number;
  storage_unit: StorageUnit;
  support_level: SupportLevel;
  customizations: CustomizationsDb;
  annual_discount: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

function mapPlan(plan: PlanDb): Plan {
  return {
    ...convertObjectKeysToCamelCase<Plan>(plan),
    ...{ customizations: convertObjectKeysToCamelCase<Customizations>(plan.customizations) },
  };
}

async function getPlans(): Promise<Plan[]> {
  const plansDb = await db.from('plans').select();
  return plansDb.map((plan: PlanDb) => mapPlan(plan));
}

async function getPlanById(id: string, fields: PlanField[]): Promise<Plan | undefined> {
  const dbFields = fields.map((field: PlanField) => snakeCase(field));
  const [firstResult] = (await db<PlanDb>('plans')
    .select(dbFields)
    .where('id', id)) as unknown as PlanDb[];
  return mapPlan(firstResult);
}

const planRepository = { getPlans, getPlanById };
export type PlanRepository = typeof planRepository;

export default planRepository;
