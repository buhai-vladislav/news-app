import { ApiProperty } from '@nestjs/swagger';

export class Base {
  @ApiProperty({
    type: String,
    required: true,
    example: 'f81570d1-5568-4a39-b0e2-aff35f43dd3e',
  })
  id: string;

  @ApiProperty({
    type: Date,
    required: true,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    required: true,
    example: new Date(),
  })
  updatedAt: Date;
}
