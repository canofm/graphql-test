import Subscription from '../models/domain/Subscription';
import subscriptionRepository from '../repositories/subscriptionRepository';

function getSubscriptions(): Promise<Subscription[]> {
  return subscriptionRepository.getSubscriptions();
}

const subscriptionService = { getSubscriptions };

export type SubscriptionService = typeof subscriptionService;

export default subscriptionService;
