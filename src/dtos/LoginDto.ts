import { IsEmail, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({ message: 'Invalid email address' })
  @ApiProperty({ example: '5DnQG@example.com', required: true })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @ApiProperty({ example: '123456', required: true })
  password: string;
}
