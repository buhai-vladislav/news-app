import { ApiProperty } from '@nestjs/swagger';
import { Base } from './Base';
import { File } from './File';
import { UserRole } from '@prisma/client';

export class User extends Base {
  @ApiProperty({ example: 'John Doe', type: String })
  fullname: string;

  @ApiProperty({ example: 'eJt6E@example.com', type: String })
  email: string;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ type: File, required: false })
  avatar?: File;

  @ApiProperty({ type: Date, required: false })
  deleteAt?: Date;
}
