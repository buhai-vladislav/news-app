import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { PostStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePostBlockDto } from './UpdatePostBlockDto';
import { Transform, Type } from 'class-transformer';

export class UpdatePostDto {
  @ApiProperty({ required: false, type: String, example: 'Title' })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiProperty({ required: false, type: String, example: 'Short description' })
  @IsOptional()
  @IsString({ message: 'Short description must be a string' })
  shortDescription?: string;

  @ApiProperty({
    required: false,
    example: PostStatus.DRAFT,
    default: PostStatus.DRAFT,
    enum: PostStatus,
  })
  @IsEnum(PostStatus, {
    message: `Status must be one of: ${Object.values(PostStatus)}`,
  })
  @IsOptional()
  status?: PostStatus;

  @ApiProperty({
    required: false,
    type: [String],
    example: ['tag1ID', 'tag2ID'],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  @Transform(({ value }) =>
    typeof value === 'string' && value.includes(',')
      ? value.split(',')
      : [value],
  )
  tags?: string[];

  @ApiProperty({
    required: false,
    type: [UpdatePostBlockDto],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Post blocks must be an array' })
  @ValidateNested({ each: true, message: 'Post blocks must be an array' })
  @Type(() => UpdatePostBlockDto)
  @Transform(({ value }) =>
    typeof value === 'string' && !value.includes('[')
      ? JSON.parse(`[${value}]`)
      : typeof value === 'string'
        ? JSON.parse(value)
        : value,
  )
  postBlocks?: UpdatePostBlockDto[];

  @ApiProperty({
    type: String,
    example: 'Post content',
    nullable: true,
    description: 'Content of the post',
    required: false,
  })
  @IsString({ message: 'Media name must be a string or null' })
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value ?? null))
  mediaName?: string | null;

  @ApiProperty({
    type: Date,
    example: '2022-01-01T00:00:00.000Z',
    nullable: true,
    description: 'Date of the post',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value ?? null))
  deletedAt?: Date | null;
}
