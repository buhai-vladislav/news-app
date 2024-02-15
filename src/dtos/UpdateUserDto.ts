import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({ required: false, example: 'John Doe' })
  fullname?: string;

  @IsOptional()
  @IsEmail({ message: 'Invalid email address.' })
  @ApiProperty({ required: false, example: 'Qp7wT@example.com' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  @ApiProperty({ required: false, example: 'password' })
  password?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid role.' })
  @ApiProperty({ required: false, example: 'admin', enum: UserRole })
  role?: UserRole;

  @IsOptional()
  @IsDateString({ message: 'Invalid date.' })
  @ApiProperty({ required: false, example: '2022-01-01T00:00:00.000Z' })
  deleteAt?: Date;
}
