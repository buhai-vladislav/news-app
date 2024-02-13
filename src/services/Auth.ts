import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './Prisma';
import { ResponseWrapper } from '../shared/utils/response';
import { Response } from 'express';
import { CreateUserDto } from '../dtos';
import { checkPassword, generatePasswordHash } from '../shared/utils/hash';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JWTPayload } from '../shared/types';

@Injectable()
export class AuthService {
  private readonly responseWrapper: ResponseWrapper;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.responseWrapper = new ResponseWrapper(AuthService.name);
  }

  /**
   * Function to sign up a new user.
   *
   * @param {CreateUserDto} dto - the user data to be used for signup
   * @param {Response} res - the response object
   * @return {Promise<Response>} the response object indicating the result of the signup process
   */
  public async signup(dto: CreateUserDto, res: Response): Promise<Response> {
    try {
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

      const pass_hash = await generatePasswordHash(dto.password);

      user = await this.prismaService.users.create({
        data: {
          ...dto,
          pass_hash,
        },
      });

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User created successfully.',
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
    const token = this.jwtService.sign(payload, options);

    return token;
  }

  /**
   * Perform a user login with email and password.
   *
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @param {Response} res - The response object
   * @return {Promise<Response>} A promise that resolves to a response object
   */
  public async login(
    email: string,
    password: string,
    res: Response,
  ): Promise<Response> {
    try {
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
   * @param {string} refreshToken - The refresh token used to obtain a new access token.
   * @param {Response} res - The response object to send the updated access and refresh tokens.
   * @return {Promise<Response>} The updated response object with new access and refresh tokens.
   */
  public async refreshToken(
    refreshToken: string,
    res: Response,
  ): Promise<Response> {
    try {
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
   * A function to logout the user using the provided refresh token.
   *
   * @param {string} refreshToken - The refresh token of the user
   * @param {Response} res - The response object
   * @return {Promise<Response>} The response after the logout operation
   */
  public async logout(refreshToken: string, res: Response): Promise<Response> {
    try {
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
