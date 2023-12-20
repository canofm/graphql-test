import db from '../db';
import { SupportLevel } from '../resolvers-types.generated';
import { BillingFrequency, Currency, StorageUnit } from '../types';

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

export type PlanFields = keyof PlanDb;

function getPlans(): Promise<PlanDb[]> {
  return db.from('plans').select();
}

async function getPlanById(id: string, fields: PlanFields[]): Promise<PlanDb | undefined> {
  const [firstResult] = await db<PlanDb>('plans').select(fields).where('id', id);
  return firstResult;
}

const planRepository = { getPlans, getPlanById };
export type PlanRepository = typeof planRepository;

export default planRepository;
