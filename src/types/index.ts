export enum Currency {
  USD = 'usd',
  PesoArgentino = 'peso_argentino',
}

export enum BillingFrequency {
  Annual = 'annual',
  Monthly = 'monthly',
}

export enum StorageUnit {
  GB = 'GB',
  TB = 'TB',
}

export enum SupportLevel {
  Basic = 'basic',
  Dedicated = 'dedicated',
  Priority = 'priority',
}

export type Customizations = {
  advancedAnalytics?: boolean | null;
  analyticsTools?: boolean | null;
  customIntegrations?: boolean | null;
};

export type Plan = {
  id: string;
  name: string;
  description: string | null;
  monthlyPrice: number;
  currency: Currency;
  billingFrequency: BillingFrequency;
  storageAmount: number;
  storageUnit: StorageUnit;
  supportLevel: SupportLevel;
  customizations: Customizations;
  annualDiscount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export const PLAN_FIELDS = <const>[
  'id',
  'name',
  'description',
  'monthlyPrice',
  'currency',
  'billingFrequency',
  'storageAmount',
  'storageUnit',
  'supportLevel',
  'customizations',
  'annualDiscount',
  'createdAt',
  'updatedAt',
  'deletedAt',
];

export type PlanField = keyof Plan;
