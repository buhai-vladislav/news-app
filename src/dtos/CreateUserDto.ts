import { UserRole } from '@prisma/client';

export class CreateUserDto {
  fullname: string;
  email: string;
  password: string;
  role: UserRole;
}
