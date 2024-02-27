import { PostStatus } from '@prisma/client';
import { Base } from './Base';
import { Tag } from './Tag';
import { PostBlock } from './PostBlock';
import { ApiProperty } from '@nestjs/swagger';

export class Post extends Base {
  @ApiProperty({ type: String, example: 'My first post' })
  title: string;

  @ApiProperty({ type: String, example: 'My first post' })
  shortDescription: string;

  @ApiProperty({ enum: PostStatus, example: PostStatus.PUBLISHED })
  status: PostStatus;

  @ApiProperty({ type: [Tag] })
  tags: Tag[];

  @ApiProperty({ type: [PostBlock] })
  postBlocks: PostBlock[];
}

export class PostSearch {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  title: string;
}
