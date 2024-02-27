import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FieldType } from '@prisma/client';

export enum PostBlockActionType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export class UpdatePostBlockDto {
  @ApiProperty({
    required: true,
    example: 'Post block ID',
  })
  @IsNotEmpty()
  @IsString({ message: 'Post block ID must be a string' })
  postBlockId: string;

  @ApiProperty({
    enum: FieldType,
    required: true,
    example: FieldType.RICH_TEXT,
  })
  @IsEnum(FieldType, {
    message: `Field type is not valid: ${Object.values(FieldType)}`,
  })
  @IsOptional()
  type?: FieldType;

  @ApiProperty({ required: true, example: 'Content' })
  @IsOptional()
  @IsString({
    message: 'Content must be a string',
  })
  content?: string;

  @ApiProperty({ required: false, example: 'file.png' })
  @IsOptional()
  @IsString({ message: 'File name must be a string' })
  fileName?: string;

  @ApiProperty({ required: false, example: 'Post block order' })
  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 },
    { message: 'Post block order must be a number' },
  )
  order?: number;

  @ApiProperty({
    enum: PostBlockActionType,
    required: true,
    example: PostBlockActionType.CREATE,
    default: PostBlockActionType.CREATE,
  })
  @IsEnum(PostBlockActionType, {
    message: `Post block action type is not valid: ${Object.values(
      PostBlockActionType,
    )}`,
  })
  @IsNotEmpty({ message: 'Post block action type is required' })
  actionType: PostBlockActionType;
}
