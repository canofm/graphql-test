import {
  BillingFrequency,
  CountryCode,
  Currency,
  StorageUnit,
  SupportLevel,
} from '../resolvers-types.generated';

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

export type OrganizationDb = {
  id: string;
  code: string;
  name: string;
  country_code: CountryCode;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export enum SubscriptionStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  PAUSED = 'paused',
}

export type SubscriptionDb = {
  id: string;
  organization_reference: string;
  plan_reference: string;
  status: SubscriptionStatus;
  starts_at: Date;
  ends_at?: Date | null;
  billing_frequency: BillingFrequency;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
};
