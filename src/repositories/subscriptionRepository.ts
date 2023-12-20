import db from '../db';
import Subscription from '../models/domain/Subscription';
import { SubscriptionDb } from '../types';

async function getSubscriptions(): Promise<Subscription[]> {
  const subscriptionsDb = await db.from('subscriptions').select();
  return subscriptionsDb.map((subcription: SubscriptionDb) => Subscription.fromDb(subcription));
}

const subscriptionRepository = { getSubscriptions };
export type SubscriptionRepository = typeof subscriptionRepository;

export default subscriptionRepository;
