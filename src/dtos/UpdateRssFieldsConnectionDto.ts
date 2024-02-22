import { IsOptional, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRssFieldsConnectionDto {
  @ApiProperty({ example: 'name', description: 'Internal field name' })
  @IsString({ message: 'Internal must be a string' })
  @IsOptional()
  internal: string;

  @ApiProperty({ example: 'item.title', description: 'External field name' })
  @IsString({ message: 'External must be a string' })
  @IsOptional()
  external: string;
}
