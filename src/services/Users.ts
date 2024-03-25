import { ResponseWrapper } from '../shared/utils/response';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './Prisma';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { generatePasswordHash } from '../shared/utils/hash';
import {
  AffectedResult,
  IBufferedFile,
  ItemsPaginated,
  ResponseBody,
  User,
  UsersFindOptions,
} from '../shared/types';
import { FilesService } from './Files';
import { removeUndefined } from 'src/shared/utils/utils';

@Injectable()
export class UsersService {
  private readonly responseWrapper: ResponseWrapper;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) {
    this.responseWrapper = new ResponseWrapper(UsersService.name);
  }

  /**
   * Create a new user with the provided data and send the appropriate response.
   *
   * @param {CreateUserDto} dto - the data for creating the new user
   * @param {Response} res - the response object for sending the response
   * @return {Promise<Response<ResponseBody<Omit<User, 'pass_hash'>>>>} a Promise that resolves to nothing
   */
  public async create(
    dto: CreateUserDto,
    res: Response,
    file?: IBufferedFile,
  ): Promise<Response<ResponseBody<Omit<User, 'pass_hash'>>>> {
    try {
      const { password, email, fullname, role } = dto;

      let user = await this.prismaService.users.findUnique({
        where: { email },
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
        data: { email, role, fullname, pass_hash } as Prisma.UsersCreateInput,
      };

      if (file) {
        const avatar = await this.filesService.uploadSingle(file);
        createOptions.data = {
          ...createOptions.data,
          avatar: {
            connect: {
              id: avatar.id,
            },
          },
        };
      }

      user = await this.prismaService.users.create(createOptions);
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
   * @return {Promise<Response<ResponseBody<Omit<User, 'pass_hash'>>>>} A Promise that resolves to undefined
   */
  public async updateById(
    userId: string,
    dto: UpdateUserDto,
    res: Response,
    file?: IBufferedFile,
  ): Promise<Response<ResponseBody<Omit<User, 'pass_hash'>>>> {
    try {
      const { password, ...rest } = dto;
      const user = await this.prismaService.users.update({
        where: { id: userId },
        data: { ...rest },
        include: {
          avatar: true,
        },
      });

      if (!user) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User to update not found.',
        );
      }

      if (file) {
        if (user.avatar) {
          const exsistsAvatart = await this.prismaService.files.delete({
            where: { id: user.avatar.id },
          });

          await this.filesService.deleteSingle(exsistsAvatart.id);
        } else {
          const avatar = await this.filesService.uploadSingle(file);

          await this.prismaService.users.update({
            where: { id: userId },
            data: {
              avatar: {
                connect: {
                  id: avatar.id,
                },
              },
            },
          });
        }
      }

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
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} Promise that resolves after the user is successfully deleted
   */
  public async deleteById(
    userId: string,
    res: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const deletedUser = await this.prismaService.users.delete({
        where: { id: userId },
        include: {
          avatar: true,
        },
      });

      if (!deletedUser) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User to delete not found.',
        );
      }

      if (deletedUser.avatar) {
        await this.filesService.deleteSingle(deletedUser.avatar.id);
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
   * @return {Promise<Response<Omit<User, 'pass_hash'>>>} a Promise that resolves when the user data is successfully sent, or rejects with an error
   */
  public async getOneById(
    userId: string,
    res: Response,
  ): Promise<Response<Omit<User, 'pass_hash'>>> {
    try {
      const user = await this.prismaService.users.findUnique({
        where: { id: userId },
        include: {
          avatar: true,
        },
      });

      if (!user) {
        return this.responseWrapper.sendError(
          res,
          HttpStatus.NOT_FOUND,
          'User to get not found.',
        );
      }

      if (user.avatar) {
        user.avatar.fileSrc = await this.filesService.getObjectUrl(
          user.avatar.fileSrc,
        );
      }

      const { pass_hash, ...userData } = user;

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.OK,
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
   * @return {Promise<Response<ItemsPaginated<Omit<User, 'pass_hash'>>>>} a Promise that resolves when the operation is complete
   */
  public async getUsersPaginated(
    options: UsersFindOptions,
    res: Response,
  ): Promise<Response<ItemsPaginated<Omit<User, 'pass_hash'>>>> {
    try {
      const { limit, page, sortBy, sortOrder } = options;
      const skip = (page - 1) * limit;

      const where: Prisma.UsersWhereInput = this.createWhereOptions(options);

      const [users, count] = await Promise.all([
        this.prismaService.users.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            avatar: true,
          },
        }),
        this.prismaService.users.count({ where }),
      ]);

      const resultUsers = await Promise.all(
        users.map(async (user) => {
          if (user.avatar) {
            user.avatar.fileSrc = await this.filesService.getObjectUrl(
              user.avatar.fileSrc,
            );
          }
          return {
            ...user,
            pass_hash: undefined,
          };
        }),
      );
      const totalPages = Math.ceil(count / limit);

      const pagination = {
        page,
        limit,
        totalPages,
        count,
      };

      return this.responseWrapper.sendSuccess(
        res,
        HttpStatus.OK,
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

  private createWhereOptions({
    search,
    deletedAt,
    role,
  }: Partial<UsersFindOptions>): Partial<Prisma.UsersWhereInput> {
    const where: Prisma.UsersWhereInput = {
      OR: search
        ? [
            { fullname: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
      deletedAt:
        deletedAt !== undefined
          ? deletedAt
            ? { equals: null }
            : { not: null }
          : undefined,
      role: role ? { equals: role } : undefined,
    };

    return removeUndefined(where);
  }
}
