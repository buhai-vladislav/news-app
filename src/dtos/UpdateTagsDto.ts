import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

class UpdateTag {
  @IsString({ message: 'Tag ID must be a string' })
  @IsNotEmpty({ message: 'Tag ID is required' })
  id: string;
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
}

export class UpdateTagsDto {
  @ApiProperty({ type: UpdateTag, isArray: true })
  @IsArray({ each: true, message: 'Tags must be an array of strings' })
  @ValidateNested({ each: true, message: 'Invalid tag' })
  @IsOptional()
  tags: UpdateTag[];
}
