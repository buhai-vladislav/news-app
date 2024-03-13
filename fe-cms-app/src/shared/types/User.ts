import { IEntity } from './Entity';
import { IMedia } from './Media';
import { SortOrder } from './SortOrder';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

interface IUser extends IEntity {
  fullname: string;
  email: string;
  role: string;
  avatar: string | IMedia;
  deletedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  posts?: IEntity[];
}

interface IUpdateUser {
  userData: FormData;
  userId: string;
}

interface IGetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export { UserRole };
export type { IUser, IUpdateUser, IGetUsersParams };
