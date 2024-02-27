import { FieldType } from '@prisma/client';
import { Base } from './Base';
import { File } from './File';
import { ApiProperty } from '@nestjs/swagger';

export class PostBlock extends Base {
  @ApiProperty({
    enum: FieldType,
    default: FieldType.RICH_TEXT,
  })
  type: FieldType;

  @ApiProperty({ type: String, example: 'This is a post block' })
  content: string;

  @ApiProperty({ type: Number, example: 1, default: 1 })
  order: number;

  @ApiProperty({ type: File, example: 'image.jpg' })
  media?: File;

  @ApiProperty({ type: String, example: '1as12e112de12e' })
  mediaId?: string;

  @ApiProperty({ type: String, example: '1as12e112de12e' })
  postId?: string;
}
