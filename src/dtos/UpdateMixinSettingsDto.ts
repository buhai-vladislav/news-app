import { IsEnum, IsNumber, IsOptional } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MixinConcatType } from '@prisma/client';

export class UpdateMixinSettingsDto {
  @ApiProperty({ enum: MixinConcatType, example: MixinConcatType.LIST })
  @IsEnum(MixinConcatType, {
    message: `concatType must be one of ${Object.values(MixinConcatType).join(', ')}`,
  })
  @IsOptional()
  concatType?: MixinConcatType;

  @ApiProperty({ example: 10 })
  @IsNumber({}, { message: 'amountPerPage must be a number' })
  @IsOptional()
  amountPerPage?: number;
}
