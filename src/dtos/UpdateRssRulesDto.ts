import { IsBoolean, IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRssRulesDto {
  @ApiProperty({
    description: 'If the rss feed should be stopped',
    example: 'true',
  })
  @IsBoolean({ message: 'isStopped must be a boolean value' })
  @IsOptional()
  isStopped?: boolean;

  @ApiProperty({
    description: 'Interval in which the rss feed should be checked in ms',
    example: '1000',
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'interval must be a number' },
  )
  @IsOptional()
  interval?: number;
}
