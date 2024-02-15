import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 1, type: Number })
  count: number;
  @ApiProperty({ example: 10, type: Number })
  limit: number;
  @ApiProperty({ example: 1, type: Number })
  page: number;
  @ApiProperty({ example: 10, type: Number })
  totalPages: number;
}

export class ItemsPaginated<T> {
  items: T[];
  pagination: PaginationMeta;
}
