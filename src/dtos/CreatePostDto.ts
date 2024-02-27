import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { FieldType, PostStatus } from '@prisma/client';
import { CreatePostBlockDto } from './CreatePostBlockDto';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsString({ message: 'Content must be a string' })
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
  @IsString({ message: 'Tags must be a string', each: true })
  @IsArray({ message: 'Tags must be an array' })
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
  @ValidateNested({ each: true, message: 'Content must be an array' })
  postBlocks: CreatePostBlockDto[];
}
