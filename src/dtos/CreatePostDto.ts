import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { FieldType, PostStatus } from '@prisma/client';
import { CreatePostBlockDto } from './CreatePostBlockDto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ type: String, example: 'Post title', required: true })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ type: String, example: 'Short description', required: true })
  @IsNotEmpty({ message: 'Short description is required' })
  @IsString({ message: 'Short description must be a string' })
  shortDescription: string;

  @ApiProperty({
    type: String,
    example: 'Post content',
    nullable: true,
    description: 'Content of the post',
  })
  @IsString({ message: 'Media name must be a string or null' })
  @IsOptional()
  @Transform(({ value }) => (value === 'null' ? null : value ?? null))
  mediaName: string | null;

  @ApiProperty({
    enum: PostStatus,
    example: PostStatus.DRAFT,
    required: true,
    default: PostStatus.DRAFT,
    description: 'Status of the post',
  })
  @IsEnum(PostStatus, {
    message: `Status must be one of: ${Object.values(PostStatus)}`,
  })
  @IsNotEmpty({ message: 'Status is required' })
  status: PostStatus;

  @ApiProperty({
    type: [String],
    example: ['tag1ID', 'tag2ID'],
    required: true,
    description: 'Tags IDs for the post',
  })
  @IsNotEmpty({ message: 'Tags are required' })
  @IsArray({ message: 'Tags must be an array' })
  @Transform(({ value }) =>
    typeof value === 'string' && value.includes(',')
      ? value.split(',')
      : [value],
  )
  tags: string[];

  @ApiProperty({
    type: [CreatePostBlockDto],
    example: [
      {
        type: FieldType.RICH_TEXT,
        content: 'Content of the block',
        order: 1,
      },
      {
        type: FieldType.MEDIA,
        fileName: 'image.png',
        order: 2,
      },
    ],
    isArray: true,
    required: true,
    description: 'Content of the post',
  })
  @IsNotEmpty({ message: 'Content is required' })
  @ValidateNested({ each: true, message: 'Post blocks must be an array' })
  @Type(() => CreatePostBlockDto)
  @Transform(({ value }) =>
    typeof value === 'string' && !value.includes('[')
      ? JSON.parse(`[${value}]`)
      : typeof value === 'string'
        ? JSON.parse(value)
        : value,
  )
  postBlocks: CreatePostBlockDto[];
}
