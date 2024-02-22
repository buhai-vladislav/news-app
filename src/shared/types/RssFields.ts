import { ApiProperty } from '@nestjs/swagger';

export class RssFields {
  @ApiProperty({ type: String, isArray: true })
  rootKeys: string[];

  @ApiProperty({ type: String, isArray: true })
  itemKeys: string[];
}
