import { HttpStatus } from '@nestjs/common';
import { TokenPair } from './TokenPair';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './User';

export class AffectedResult {
  @ApiProperty({ example: true })
  isAffected: boolean;
}

export class SignInResult extends TokenPair {
  @ApiProperty({ type: User })
  user: User;
}

export class ResponseBody<T> {
  @ApiProperty({ example: 'Message example.' })
  message: string;
  @ApiProperty({ example: 200 })
  status: HttpStatus;
  data?: T;
  error?: any;
}
