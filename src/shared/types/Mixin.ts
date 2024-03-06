import { MixinConcatType, MixinType, MixinStatus } from '@prisma/client';
import { Base } from './Base';
import { ApiProperty } from '@nestjs/swagger';

export class Mixin extends Base {
  @ApiProperty({
    enum: MixinConcatType,
    description: 'The type of page to display',
  })
  concatTypes: MixinConcatType[];

  @ApiProperty({ type: Number, description: 'The order percentage' })
  orderPercentage: number;

  @ApiProperty({
    enum: MixinType,
    description: `The type of page to mixin: ${Object.keys(MixinType).join(', ')}`,
  })
  type: MixinType;

  @ApiProperty({
    enum: MixinStatus,
    description: `The status of the mixin: ${Object.keys(MixinStatus).join(
      ', ',
    )}`,
  })
  status: MixinStatus;

  @ApiProperty({ type: String, description: 'The text of the mixin' })
  text?: string;

  @ApiProperty({ type: String, description: 'The URL of the mixin' })
  linkUrl?: string;

  @ApiProperty({ type: String, description: 'The text of the mixin' })
  linkText?: string;

  @ApiProperty({ type: String, description: 'The ID of the post' })
  postId?: string;

  @ApiProperty({ type: String, description: 'The ID of the file' })
  mediaId?: string;
}

export class MixinSetting extends Base {
  @ApiProperty({
    enum: MixinConcatType,
    description: 'The type of page to display',
  })
  concatType: MixinConcatType;

  @ApiProperty({ type: Number, description: 'The amount of items per page' })
  amountPerPage: number;
}
