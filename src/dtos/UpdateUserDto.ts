import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  fullname?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  deleteAt?: Date;
}
