import { ApiProperty } from '@nestjs/swagger';
import { Base } from './Base';

export class RssFieldsConnection extends Base {
  @ApiProperty({ type: String, example: 'name' })
  internal: string;

  @ApiProperty({ type: String, example: 'itunes.title' })
  external: string;
}
