import { CountryCode, Currency, InvoiceStatus } from '../../resolvers-types.generated';
import { InvoiceDb } from '../../types';

class Invoice {
  public id: string;

  public organizationReference: string;

  public status: InvoiceStatus;

  public amount: number;

  public currency: Currency;

  public dueDateAt: string;

  public billingAddress: string;

  public billingZipCode: string;

  public billingCountryCode: CountryCode;

  public billingFullName: string;

  public updatedBy: string;

  public createdAt: string;

  public updatedAt: string;

  public deletedAt?: string | null;

  static fromDb(i: InvoiceDb): Invoice {
    const invoice = new Invoice();
    invoice.id = i.id;
    invoice.organizationReference = i.organization_reference;
    invoice.status = i.status;
    invoice.amount = i.amount;
    invoice.currency = i.currency;
    invoice.dueDateAt = i.due_date_at.toISOString();
    invoice.billingAddress = i.billing_address;
    invoice.billingZipCode = i.billing_zip_code;
    invoice.billingCountryCode = i.billing_country_code;
    invoice.billingFullName = i.billing_full_name;
    invoice.createdAt = i.created_at.toISOString();
    invoice.updatedAt = i.updated_at.toISOString();
    invoice.deletedAt = i.deleted_at?.toISOString();
    return invoice;
  }
}

export default Invoice;
