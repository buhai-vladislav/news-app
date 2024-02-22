import { ApiProperty } from '@nestjs/swagger';
import { Base } from './Base';
import { RssFieldsConnection } from './RssFieldsConnection';

export class RssSource extends Base {
  @ApiProperty({ example: 'https://example.com/rss' })
  source: string;

  @ApiProperty({ example: 10 })
  interval: number;

  @ApiProperty({ example: false })
  isStopped: boolean;

  @ApiProperty({ example: '0b0c2a53-7b5c-40cc-87c0-6906d36d2304' })
  creatorId: string;

  @ApiProperty({ type: [RssFieldsConnection] })
  connections?: RssFieldsConnection[];
}
