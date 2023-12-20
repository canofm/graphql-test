import { Cache } from '../cache';
import db from '../db';
import Subscription from '../models/domain/Subscription';
import { SubscriptionDb } from '../types';

async function getSubscriptions(): Promise<Subscription[]> {
  const subscriptionsDb = await db.from('subscriptions').select();
  return subscriptionsDb.map((subcription: SubscriptionDb) => Subscription.fromDb(subcription));
}

async function getLastPaymentDate(
  organizationReference: string,
  subscriptionId: string,
): Promise<Date | undefined> {
  const cacheKey = `lastPaymentDate:${subscriptionId}`;
  try {
    const lastPaymentDate = await Cache.get<Date>(cacheKey);
    if (lastPaymentDate) {
      return new Date(lastPaymentDate);
    }
  } catch (error: unknown) {
    // cache may be disconnected
    console.error({ error });
  }

  const [lastPayment] = await db
    .from('payments as p')
    .select('p.updated_at')
    .join(
      db
        .from('invoices as i')
        .limit(1)
        .where('i.organization_reference', organizationReference)
        .andWhere('i.subscription_reference', subscriptionId)
        .andWhere('i.status', 'paid')
        .orderBy('i.updated_at', 'desc')
        .as('r'),
      'p.invoice_reference',
      'r.id',
    );
  if (lastPayment) {
    Cache.set(cacheKey, lastPayment.updated_at, 60 * 15); // ttl: 15 mins
    return new Date(lastPayment.updated_at);
  }
  return;
}

const subscriptionRepository = { getSubscriptions, getLastPaymentDate };
export type SubscriptionRepository = typeof subscriptionRepository;

export default subscriptionRepository;
