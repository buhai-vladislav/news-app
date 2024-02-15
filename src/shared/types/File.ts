import { ApiProperty } from '@nestjs/swagger';
import { Base } from './Base';

export type AppMimeType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'application/octet-stream';

export const FileTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/octet-stream',
];

export interface IBufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer | string;
}

export class File extends Base {
  @ApiProperty({
    required: true,
    type: String,
    example: 'image.png',
  })
  name: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '7bit',
  })
  encoding: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'image/png',
  })
  mimetype: AppMimeType;

  @ApiProperty({
    required: true,
    type: Number,
    example: 100,
  })
  size: number;

  @ApiProperty({
    required: true,
    type: String,
    example: 'f1cd1c0afefc8ddc2ca5fe8198de127a.PNG',
  })
  fileSrc?: string;
}
