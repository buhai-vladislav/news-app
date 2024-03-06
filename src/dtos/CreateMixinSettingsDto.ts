import { IsEnum, IsNotEmpty, IsNumber } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MixinConcatType } from '@prisma/client';

export class CreateMixinSettingsDto {
  @ApiProperty({ enum: MixinConcatType, example: MixinConcatType.PAGINATION })
  @IsEnum(MixinConcatType, {
    message: `concatType must be one of ${Object.values(MixinConcatType).join(', ')}`,
  })
  @IsNotEmpty({ message: 'concatType is required' })
  concatType: MixinConcatType;

  @ApiProperty({ example: 10 })
  @IsNumber({}, { message: 'amountPerPage must be a number' })
  @IsNotEmpty({ message: 'amountPerPage is required' })
  amountPerPage: number;
}
