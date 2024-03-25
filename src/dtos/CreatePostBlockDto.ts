import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '@prisma/client';

export class CreatePostBlockDto {
  @ApiProperty({
    enum: FieldType,
    required: true,
    example: FieldType.RICH_TEXT,
  })
  @IsEnum(FieldType, {
    message: `Field type is not valid: ${Object.values(FieldType)}`,
  })
  @IsNotEmpty({
    message: 'Field type is required',
  })
  type: FieldType;

  @ApiProperty({ required: true, example: 'Content' })
  @IsNotEmpty({
    message: 'Content is required',
  })
  @IsString({
    message: 'Content must be a string',
  })
  content: string;

  @ApiProperty({ required: false, example: 'File name' })
  @IsOptional()
  @IsString({ message: 'File name must be a string' })
  fileName?: string;

  @ApiProperty({ required: true, example: 1 })
  @IsNotEmpty({ message: 'Post block order are required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'Post block order must be a number' },
  )
  order: number;
}
