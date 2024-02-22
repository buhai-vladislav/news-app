import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRssFieldsConnectionDto {
  @ApiProperty({ example: 'name', description: 'Internal field name' })
  @IsString({ message: 'Internal must be a string' })
  @IsNotEmpty({ message: 'Internal must not be empty' })
  internal: string;

  @ApiProperty({ example: 'item.title', description: 'External field name' })
  @IsString({ message: 'External must be a string' })
  @IsNotEmpty({ message: 'External must not be empty' })
  external: string;
}
