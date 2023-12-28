import db from '../db';
import Invoice from '../models/domain/Invoice';
import { InvoiceDb } from '../types';

async function getInvoicesFromSubscription(subscriptionId: string): Promise<Invoice[]> {
  const invoicesDb = await db
    .from('invoices')
    .select()
    .where('subscription_reference', subscriptionId);
  return invoicesDb.map((invoice: InvoiceDb) => Invoice.fromDb(invoice));
}

const invoiceRepository = { getInvoicesFromSubscription };
export type InvoiceRepository = typeof invoiceRepository;

export default invoiceRepository;
