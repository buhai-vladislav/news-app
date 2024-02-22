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
import { CreateRssFieldsConnectionDto } from './CreateRssFieldsConnectionDto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRssSourceDto {
  @ApiProperty({
    example: 'https://www.example.com',
    description: 'The URL of the RSS feed',
  })
  @IsString({ message: 'Must be a string' })
  @IsUrl({ message: 'Must be a valid URL' })
  source: string;

  @ApiProperty({
    example: false,
    description: 'Whether the RSS source is stopped or not',
  })
  @IsBoolean({ message: 'IsStopped must be a boolean' })
  @IsNotEmpty({ message: 'IsStopped cannot be empty' })
  isStopped: boolean;

  @ApiProperty({
    example: 60,
    description: 'The interval in seconds between each update',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'Interval cannot be empty' })
  interval: number;

  @ApiProperty({
    isArray: true,
    type: CreateRssFieldsConnectionDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  connections?: CreateRssFieldsConnectionDto[];
}
