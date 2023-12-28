import { Role } from '../../resolvers-types.generated';
import { UserDb } from '../../types';

class User {
  public id: string;

  public organizationReference: string;

  public email: string;

  public firstname: string;

  public lastname: string;

  public avatar?: string | null;

  public role: Role;

  public createdAt: string;

  public updatedAt: string;

  public deletedAt?: string | null;

  static fromDb(user: UserDb): User {
    const u = new User();
    u.id = user.id;
    u.organizationReference = user.organization_reference;
    u.email = user.email;
    u.firstname = user.firstname;
    u.lastname = user.lastname;
    u.avatar = user.avatar;
    u.role = user.role;
    u.createdAt = user.created_at.toISOString();
    u.updatedAt = user.updated_at.toISOString();
    u.deletedAt = user.deleted_at?.toISOString();
    return u;
  }
}

export default User;
