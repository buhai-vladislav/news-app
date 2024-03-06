import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from '@nestjs/class-validator';
import { MixinConcatType, MixinStatus, MixinType } from '@prisma/client';
import { IBufferedFile } from 'src/shared/types';

export class UpdateMixinDto {
  @IsEnum(MixinConcatType, {
    message: `concatType must be a valid enum value: ${Object.values(MixinConcatType)}`,
    each: true,
  })
  @IsOptional()
  concatTypes?: MixinConcatType[];

  @IsOptional()
  @IsNumber()
  orderPercentage?: number;

  @IsOptional()
  @IsEnum(MixinType, {
    message: `type must be a valid enum value: ${Object.values(MixinType)}`,
  })
  type?: MixinType;

  @IsOptional()
  @IsEnum(MixinStatus, {
    message: `status must be a valid enum value: ${Object.values(MixinStatus)}`,
  })
  status?: MixinStatus;

  @IsOptional()
  @IsString({ message: 'text must be a string' })
  text?: string;

  @IsOptional()
  @IsString({ message: 'linkUrl must be a string' })
  @IsUrl()
  linkUrl?: string;

  @IsOptional()
  @IsString({ message: 'linkText must be a string' })
  linkText?: string;

  @IsOptional()
  @IsString({ message: 'postId must be a string' })
  postId?: string;

  file?: IBufferedFile;
}
