import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/Auth';
import { CreateUserDto, LoginDto, RefreshTokensDto } from '../dtos';
import { AffectedResult, ResponseBody, TokenPair, User } from '../shared/types';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from 'src/shared/decorators/ApiErrorResponse';
import { ApiSuccessResponse } from 'src/shared/decorators/ApiOkResponse';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiSuccessResponse(
    AffectedResult,
    'User signed up successfully.',
    HttpStatus.CREATED,
  )
  @ApiErrorResponse(String, 'User already exists', HttpStatus.BAD_REQUEST)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Post('signup')
  public async signup(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.authService.signup(createUserDto, response);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiSuccessResponse(TokenPair, 'User logged in successfully.', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Password or email is incorrect.',
    HttpStatus.UNAUTHORIZED,
  )
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<TokenPair>>> {
    return this.authService.login(loginDto, response);
  }

  @ApiOperation({ summary: 'Refresh tokens pair' })
  @ApiSuccessResponse(
    TokenPair,
    'Tokens pair refreshed successfully.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Invalid token.', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Post('refresh')
  public async refreshToken(
    @Body() refreshTokenDto: RefreshTokensDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<TokenPair>>> {
    return this.authService.refreshToken(refreshTokenDto, response);
  }

  @ApiOperation({ summary: 'Logout a user' })
  @ApiSuccessResponse(
    AffectedResult,
    'User logged out successfully.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Invalid token.', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Post('logout')
  public async logout(
    @Body() refreshTokenDto: RefreshTokensDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.authService.logout(refreshTokenDto, response);
  }
}
