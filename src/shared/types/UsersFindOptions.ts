import { UserRole } from '@prisma/client';
import { SortOrder } from './SortOrder';

export class UsersFindOptions {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  deletedAt?: boolean;
  sortBy?: string;
  sortOrder?: SortOrder;
}
