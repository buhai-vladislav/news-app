import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from '@nestjs/class-validator';
import { UpdateRssFieldsConnectionDto } from './UpdateRssFieldsConnectionDto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRssSourceDto {
  @ApiProperty({
    example: 'https://www.example.com',
    description: 'The URL of the RSS feed',
  })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  source?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the RSS source is stopped or not',
  })
  @IsBoolean({ message: 'IsStopped must be a boolean' })
  @IsOptional()
  isStopped?: boolean;

  @ApiProperty({
    example: 60,
    description: 'The interval in seconds between each update',
  })
  @IsNumber()
  @IsOptional()
  interval?: number;

  @ApiProperty({
    isArray: true,
    type: UpdateRssFieldsConnectionDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  connections?: UpdateRssFieldsConnectionDto[];
}
