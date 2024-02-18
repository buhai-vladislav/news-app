import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './Prisma';
import { ResponseWrapper } from '../shared/utils/response';
import { Response } from 'express';
import { CreateUserDto, LoginDto, RefreshTokensDto } from '../dtos';
import { checkPassword, generatePasswordHash } from '../shared/utils/hash';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  AffectedResult,
  IBufferedFile,
  JWTPayload,
  ResponseBody,
  TokenPair,
} from '../shared/types';
import { FilesService } from './Files';
import { Prisma } from '.prisma/client';

@Injectable()
export class AuthService {
  private readonly responseWrapper: ResponseWrapper;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly filesService: FilesService,
  ) {
    this.responseWrapper = new ResponseWrapper(AuthService.name);
  }

  /**
   * Function to sign up a new user.
   *
   * @param {CreateUserDto} dto - the user data to be used for signup
   * @param {Response} res - the response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} the response object indicating the result of the signup process
   */
  public async signup(
    dto: CreateUserDto,
    res: Response,
    file?: IBufferedFile,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const { password, ...rest } = dto;
      let user = await this.prismaService.users.findUnique({
        where: { email: dto.email },
      });

      if (user) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.BAD_REQUEST,
          'User already exists',
        );
      }

      const pass_hash = await generatePasswordHash(password);

      const createOptions = {
        data: {
          ...rest,
          pass_hash,
        } as Prisma.UsersCreateInput,
      };

      if (file) {
        const avatar = await this.filesService.uploadSingle(file);

        createOptions.data.avatar = {
          connect: {
            id: avatar.id,
          },
        };
      }

      user = await this.prismaService.users.create(createOptions);

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User signed up successfully.',
        { isAffected: !!user },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Signs a token with the given payload and options.
   *
   * @param {JWTPayload} payload - The payload to be signed.
   * @param {JwtSignOptions} [options] - The options for signing the token.
   * @return {string} The signed token.
   */
  private signToken(payload: JWTPayload, options?: JwtSignOptions): string {
    const token = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET || 'SECRET',
      ...options,
    });

    return token;
  }

  /**
   * A method to handle user login.
   *
   * @param {LoginDto} loginDto - the login data transfer object
   * @param {Response} res - the response object
   * @return {Promise<Response<ResponseBody<TokenPair>>>} a promise containing the response with token pair
   */
  public async login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<Response<ResponseBody<TokenPair>>> {
    try {
      const { email, password } = loginDto;
      const user = await this.prismaService.users.findUnique({
        where: { email },
      });

      if (!user) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.UNAUTHORIZED,
          'Password or email is incorrect.',
        );
      }

      const isValid = await checkPassword(password, user.pass_hash);

      if (!isValid) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.UNAUTHORIZED,
          'Password or email is incorrect.',
        );
      }

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.signToken(payload);
      const refreshToken = this.signToken(payload, { expiresIn: '7d' });

      await this.prismaService.token.create({
        data: {
          token: refreshToken,
        },
      });

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.OK,
        'Login successful.',
        { accessToken, refreshToken },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Refreshes the access token using the provided refresh token.
   *
   * @param {RefreshTokensDto} refreshTokenDto - The refresh token used to obtain a new access token.
   * @param {Response} res - The response object to send the updated access and refresh tokens.
   * @return {Promise<Response<ResponseBody<TokenPair>>>} The updated response object with new access and refresh tokens.
   */
  public async refreshToken(
    refreshTokenDto: RefreshTokensDto,
    res: Response,
  ): Promise<Response<ResponseBody<TokenPair>>> {
    try {
      const { refreshToken } = refreshTokenDto;
      const token = await this.prismaService.token.findUnique({
        where: { token: refreshToken },
      });

      if (!token) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.UNAUTHORIZED,
          'Invalid token.',
        );
      }

      const payload = this.jwtService.verify(refreshToken);

      const accessToken = this.signToken(payload);
      const newRefreshToken = this.signToken(payload, { expiresIn: '7d' });

      await this.prismaService.token.update({
        where: { id: token.id },
        data: { token: newRefreshToken },
      });

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.OK,
        'Login successful.',
        { accessToken, refreshToken: newRefreshToken },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Logout function that handles the logout process.
   *
   * @param {RefreshTokensDto} refreshTokenDto - the data transfer object containing the refresh token
   * @param {Response} res - the response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} a promise that resolves to the response containing the affected result
   */
  public async logout(
    refreshTokenDto: RefreshTokensDto,
    res: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const { refreshToken } = refreshTokenDto;
      const token = await this.prismaService.token.findUnique({
        where: { token: refreshToken },
      });

      if (!token) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.UNAUTHORIZED,
          'Invalid refresh token.',
        );
      }

      await this.prismaService.token.delete({
        where: { id: token.id },
      });

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.OK,
        'Logout successful.',
        { isAffected: true },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }
}
