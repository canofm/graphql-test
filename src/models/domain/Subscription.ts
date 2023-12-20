import { add } from 'date-fns';
import { BillingFrequency, SubscriptionDb, SubscriptionStatus } from '../../types';

class Subscription {
  public id: string;

  public organizationReference: string;

  public planReference: string;

  public status: SubscriptionStatus;

  public startsAt: string;

  public endsAt: string | null;

  public billingFrequency: BillingFrequency;

  public createdAt: string;

  public updatedAt: string;

  public deletedAt: string | null;

  static fromDb(subscription: SubscriptionDb): Subscription {
    const sub = new Subscription();
    sub.id = subscription.id;
    sub.organizationReference = subscription.organization_reference;
    sub.planReference = subscription.plan_reference;
    sub.status = subscription.status;
    sub.startsAt = subscription.starts_at.toISOString();
    sub.endsAt = subscription.ends_at?.toISOString() ?? null;
    sub.billingFrequency = subscription.billing_frequency;
    sub.createdAt = subscription.created_at.toISOString();
    sub.updatedAt = subscription.updated_at.toISOString();
    sub.deletedAt = subscription.deleted_at?.toISOString() ?? null;
    return sub;
  }

  public async getNextPaymentDate(lastPaymentDate?: Date): Promise<Date> {
    const { billingFrequency, startsAt } = this;
    const duration = billingFrequency === BillingFrequency.Annual ? 'years' : 'months';
    // if there is not any payment register, then should use the startsAt date
    const basePaymentDate = lastPaymentDate ?? new Date(startsAt);
    return add(basePaymentDate, { [duration]: 1 });
  }
}

export default Subscription;
