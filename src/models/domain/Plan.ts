import { BillingFrequency, Currency, PlanDb, StorageUnit, SupportLevel } from '../../types';
import convertObjectKeysToCamelCase from '../../utils/convertObjectKeysToCamelCase';

type Customizations = {
  advancedAnalytics?: boolean | null;
  analyticsTools?: boolean | null;
  customIntegrations?: boolean | null;
};

class Plan {
  public id: string;

  public name: string;

  public description?: string | null;

  public monthlyPrice: number;

  public currency: Currency;

  public billingFrequency: BillingFrequency;

  public storageAmount: number;

  public storageUnit: StorageUnit;

  public supportLevel: SupportLevel;

  public customizations: Customizations;

  public annualDiscount: number;

  public createdAt: string;

  public updatedAt: string;

  public deletedAt: string | null;

  static fromDb(planDb: PlanDb): Plan {
    const plan = new Plan();
    plan.id = planDb.id;
    plan.name = planDb.name;
    plan.description = planDb.description;
    plan.monthlyPrice = planDb.monthly_price;
    plan.currency = planDb.currency;
    plan.billingFrequency = planDb.billing_frequency;
    plan.storageAmount = planDb.storage_amount;
    plan.storageUnit = planDb.storage_unit;
    plan.supportLevel = planDb.support_level;
    plan.customizations = convertObjectKeysToCamelCase(planDb.customizations);
    plan.createdAt = planDb.created_at.toISOString();
    plan.updatedAt = planDb.updated_at.toISOString();
    plan.deletedAt = planDb.deleted_at?.toISOString() ?? null;
    return plan;
  }
}

export default Plan;
