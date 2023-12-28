import {
  BillingFrequency,
  CountryCode,
  Currency,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
  StorageUnit,
  SubscriptionStatus,
  SupportLevel,
} from '../resolvers-types.generated';

type CustomizationsDb = {
  advanced_analytics?: boolean | null;
  analytics_tools?: boolean | null;
  custom_integrations?: boolean | null;
};

interface EntityDb {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

interface EntityDbWithOrg extends EntityDb {
  organization_reference: string;
}

export interface PlanDb extends EntityDb {
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
}

export interface OrganizationDb extends EntityDb {
  code: string;
  name: string;
  country_code: CountryCode;
}

export interface SubscriptionDb extends EntityDbWithOrg {
  plan_reference: string;
  status: SubscriptionStatus;
  starts_at: Date;
  ends_at?: Date | null;
  billing_frequency: BillingFrequency;
}

export interface UserDb extends EntityDbWithOrg {
  email: string;
  firstname: string;
  lastname: string;
  avatar?: string | null;
  role: Role;
}

export interface InvoiceDb extends EntityDbWithOrg {
  subscription_reference: string;
  status: InvoiceStatus;
  amount: number;
  currency: Currency;
  due_date_at: Date;
  billing_address: string;
  billing_zip_code: string;
  billing_country_code: CountryCode;
  billing_full_name: string;
  updated_by: string;
}

export interface PaymentDb extends EntityDbWithOrg {
  invoice_reference: string;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  payment_method: PaymentMethod;
}
