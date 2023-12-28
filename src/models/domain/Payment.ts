import { Currency, PaymentMethod, PaymentStatus } from '../../resolvers-types.generated';
import { PaymentDb } from '../../types';

class Payment {
  public id: string;

  public organizationReference: string;

  public invoice: string;

  public status: PaymentStatus;

  public amount: number;

  public currency: Currency;

  public paymentMethod: PaymentMethod;

  public createdAt: string;

  public updatedAt: string;

  public deletedAt?: string | null;

  static fromDb(p: PaymentDb): Payment {
    const payment = new Payment();
    payment.id = p.id;
    payment.organizationReference = p.organization_reference;
    payment.status = p.status;
    payment.amount = p.amount;
    payment.currency = p.currency;
    payment.paymentMethod = p.payment_method;
    payment.createdAt = p.created_at.toISOString();
    payment.updatedAt = p.updated_at.toISOString();
    payment.deletedAt = p.deleted_at?.toISOString();
    return payment;
  }
}

export default Payment;
