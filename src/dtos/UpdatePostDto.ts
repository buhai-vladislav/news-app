import { IsArray, IsEnum, IsOptional, IsString } from '@nestjs/class-validator';
import { PostStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UpdatePostBlockDto } from './UpdatePostBlockDto';

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
  @IsString({ message: 'Tags must be a string', each: true })
  @IsArray({ message: 'Tags must be an array' })
  tags?: string[];

  @ApiProperty({
    required: false,
    type: [UpdatePostBlockDto],
    isArray: true,
  })
  @IsOptional()
  @IsArray({ message: 'Post blocks must be an array' })
  postBlocks?: UpdatePostBlockDto[];
}
