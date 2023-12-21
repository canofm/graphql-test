import { CountryCode } from '../../resolvers-types.generated';
import { OrganizationDb } from '../../types';

class Organization {
  public id: string;

  public code: string;

  public name: string;

  public countryCode: CountryCode;

  public createdAt: string;

  public updatedAt: string;

  public deletedAt: string | null;

  static fromDb(org: OrganizationDb): Organization {
    const organization = new Organization();
    organization.id = org.id;
    organization.code = org.code;
    organization.name = org.name;
    organization.countryCode = org.country_code;
    organization.createdAt = org.created_at.toISOString();
    organization.updatedAt = org.updated_at.toISOString();
    organization.deletedAt = org.deleted_at?.toISOString() ?? null;
    return organization;
  }
}

export default Organization;
