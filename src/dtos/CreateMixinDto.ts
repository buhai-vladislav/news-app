import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from '@nestjs/class-validator';
import { MixinConcatType, MixinStatus, MixinType } from '@prisma/client';
import { IBufferedFile } from '../shared/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMixinDto {
  @ApiProperty({
    enum: MixinConcatType,
    isArray: true,
  })
  @IsEnum(MixinConcatType, {
    message: `concatType must be a valid enum value: ${Object.values(MixinConcatType)}`,
    each: true,
  })
  @IsNotEmpty({ message: 'concatType is required' })
  concatTypes: MixinConcatType[];

  @ApiProperty({
    example: 100,
    type: Number,
  })
  @IsNotEmpty({ message: 'orderPercentage is required' })
  @IsNumber()
  orderPercentage: number;

  @ApiProperty({
    enum: MixinType,
    example: MixinType.TEXT,
  })
  @IsNotEmpty({ message: 'type is required' })
  @IsEnum(MixinType, {
    message: `type must be a valid enum value: ${Object.values(MixinType)}`,
  })
  type: MixinType;

  @ApiProperty({
    enum: MixinStatus,
    example: MixinStatus.HIDDEN,
  })
  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(MixinStatus, {
    message: `status must be a valid enum value: ${Object.values(MixinStatus)}`,
  })
  status: MixinStatus;

  @ApiProperty({
    example: 'text',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'text must be a string' })
  text?: string;

  @ApiProperty({
    example: 'https://example.com',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'linkUrl must be a string' })
  @IsUrl()
  linkUrl?: string;

  @ApiProperty({
    example: 'Example',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'linkText must be a string' })
  linkText?: string;

  @ApiProperty({
    example: 'r32r112r1r13q2323',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'postId must be a string' })
  postId?: string;

  file?: IBufferedFile;
}
