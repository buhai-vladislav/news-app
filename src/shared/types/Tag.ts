import { ApiProperty } from '@nestjs/swagger';
import { Base } from './Base';

export class Tag extends Base {
  @ApiProperty({ example: 'tag' })
  name: string;
}
