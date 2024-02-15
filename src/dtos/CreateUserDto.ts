import { IsEmail, IsEnum, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Fullname is required' })
  @IsString({ message: 'Fullname must be a string' })
  @ApiProperty({ required: true, example: 'John Doe' })
  fullname: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({ message: 'Email must be a valid email address' })
  @ApiProperty({ required: true, example: 'johndoe' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @ApiProperty({ required: true, example: 'password123' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be a valid role' })
  @ApiProperty({ required: true, example: 'ADMIN', enum: UserRole })
  role: UserRole;
}
