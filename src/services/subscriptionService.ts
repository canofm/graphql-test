import { add } from 'date-fns';
import Subscription from '../models/domain/Subscription';
import subscriptionRepository from '../repositories/subscriptionRepository';
import { BillingFrequency } from '../types';

function getSubscriptions(): Promise<Subscription[]> {
  return subscriptionRepository.getSubscriptions();
}

function getLastPaymentDate(organizationReference: string, subscriptionId: string): Promise<Date> {
  return subscriptionRepository.getLastPaymentDate(organizationReference, subscriptionId);
}

async function getNextPaymentDate(subscription: Subscription): Promise<Date> {
  const { organizationReference, id } = subscription;
  const lastPayment = await subscriptionRepository.getLastPaymentDate(organizationReference, id);
  return subscription.getNextPaymentDate(lastPayment);
}

const subscriptionService = { getSubscriptions, getLastPaymentDate, getNextPaymentDate };

export type SubscriptionService = typeof subscriptionService;

export default subscriptionService;
