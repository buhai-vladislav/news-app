import { ArrayMinSize, IsArray, IsString } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagsDto {
  @ApiProperty({ type: [String], example: ['tag1', 'tag2'] })
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Tags must be an array of strings' })
  @ArrayMinSize(1)
  tags: string[];
}
