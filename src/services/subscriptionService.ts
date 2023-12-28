import { pick } from 'lodash';
import Invoice from '../models/domain/Invoice';
import Subscription from '../models/domain/Subscription';
import invoiceRepository from '../repositories/invoiceRepository';
import subscriptionRepository from '../repositories/subscriptionRepository';

function getSubscriptions(): Promise<Subscription[]> {
  return subscriptionRepository.getSubscriptions();
}

function getLastPaymentDate(
  organizationReference: string,
  subscriptionId: string,
): Promise<Date | undefined> {
  return subscriptionRepository.getLastPaymentDate(organizationReference, subscriptionId);
}

async function getNextPaymentDate(subscription: Subscription): Promise<Date> {
  const { organizationReference, id } = subscription;
  const lastPayment = await subscriptionRepository.getLastPaymentDate(organizationReference, id);
  return subscription.getNextPaymentDate(lastPayment);
}

async function getInvoices(subscriptionId: string, fields?: (keyof Invoice)[]): Promise<Invoice[]> {
  const invoices = await invoiceRepository.getInvoicesFromSubscription(subscriptionId);
  return fields ? invoices.map((invoice) => pick(invoice, fields)) : invoices;
}

const subscriptionService = {
  getSubscriptions,
  getLastPaymentDate,
  getNextPaymentDate,
  getInvoices,
};

export type SubscriptionService = typeof subscriptionService;

export default subscriptionService;
