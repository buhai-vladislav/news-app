import { ResponseWrapper } from '../shared/utils/response';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './Prisma';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { generatePasswordHash } from '../shared/utils/hash';
import { UsersFindOptions, SortOrder } from '../shared/types';

@Injectable()
export class UsersService {
  private readonly responseWrapper: ResponseWrapper;
  constructor(private readonly prismaService: PrismaService) {
    this.responseWrapper = new ResponseWrapper(UsersService.name);
  }

  /**
   * Create a new user with the provided data and send the appropriate response.
   *
   * @param {CreateUserDto} dto - the data for creating the new user
   * @param {Response} res - the response object for sending the response
   * @return {Promise<Response>} a Promise that resolves to nothing
   */
  public async create(dto: CreateUserDto, res: Response): Promise<Response> {
    try {
      const { password } = dto;
      const pass_hash = await generatePasswordHash(password);

      const user = await this.prismaService.users.create({
        data: { ...dto, pass_hash },
      });
      const { pass_hash: _, ...newUser } = user;

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User created successfully.',
        newUser,
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
   * Update user by ID.
   *
   * @param {string} userId - The ID of the user to update
   * @param {UpdateUserDto} dto - The data to update the user with
   * @param {Response} res - The response object
   * @return {Promise<Response>} A Promise that resolves to undefined
   */
  public async updateById(
    userId: string,
    dto: UpdateUserDto,
    res: Response,
  ): Promise<Response> {
    try {
      const { password, ...updateDto } = dto;
      const user = await this.prismaService.users.update({
        where: { id: userId },
        data: { ...updateDto },
      });

      if (password) {
        const pass_hash = await generatePasswordHash(password);

        await this.prismaService.users.update({
          where: { id: userId },
          data: { pass_hash },
        });
      }

      const { pass_hash: _, ...updatedUser } = user;

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User updated successfully.',
        updatedUser,
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
   * Delete a user by their ID.
   *
   * @param {string} userId - The ID of the user to delete
   * @param {Response} res - The response object
   * @return {Promise<Response>} Promise that resolves after the user is successfully deleted
   */
  public async deleteById(userId: string, res: Response): Promise<Response> {
    try {
      const deletedUser = await this.prismaService.users.delete({
        where: { id: userId },
      });

      if (!deletedUser) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User to delete not found.',
        );
      }

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User deleted successfully.',
        { isAffected: !!deletedUser },
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
   * Retrieves a user by their ID and sends the user data in the response.
   *
   * @param {string} userId - the ID of the user to retrieve
   * @param {Response} res - the response object to send the user data
   * @return {Promise<Response>} a Promise that resolves when the user data is successfully sent, or rejects with an error
   */
  public async getOneById(userId: string, res: Response): Promise<Response> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User to get not found.',
        );
      }

      const { pass_hash, ...userData } = user;

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User retreived successfully.',
        userData,
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
   * Function to get users paginated.
   *
   * @param {UsersFindOptions} options - options for finding users
   * @param {Response} res - the response object
   * @return {Promise<Response>} a Promise that resolves when the operation is complete
   */
  public async getUsersPaginated(
    options: UsersFindOptions,
    res: Response,
  ): Promise<Response> {
    try {
      const { limit, page, deletedAt, role, search, sortBy, sortOrder } =
        options;
      const skip = (page - 1) * limit;

      const where: Prisma.UsersWhereInput = {
        OR: search
          ? [
              { fullname: { contains: search } },
              { email: { contains: search } },
            ]
          : [],
        deleteAt: deletedAt
          ? {
              not: null,
            }
          : undefined,
        role: role ? { equals: role } : undefined,
      };

      const [users, count] = await Promise.all([
        this.prismaService.users.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
        }),
        this.prismaService.users.count({ where }),
      ]);

      const resultUsers = users.map((user) => ({
        ...user,
        pass_hash: undefined,
      }));
      const totalPages = Math.ceil(count / limit);

      const pagination = {
        page,
        limit,
        totalPages,
        count,
      };

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.CREATED,
        'User retreived successfully.',
        {
          items: resultUsers,
          pagination,
        },
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
