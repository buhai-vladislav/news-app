import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from '../services/Users';
import { CreateUserDto, UpdateUserDto } from '../dtos';
import { Response } from 'express';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  USERS_SORT_KEYS,
} from '../shared/utils/constants';
import { UserRole } from '@prisma/client';
import {
  AffectedResult,
  ItemsPaginated,
  ResponseBody,
  SortOrder,
  User,
} from '../shared/types';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiErrorResponse } from '../shared/decorators/ApiErrorResponse';
import { ApiSuccessResponse } from '../shared/decorators/ApiOkResponse';
import { ApiOkResponsePaginated } from '../shared/decorators/ApiOkPaginatedResponse';
import { CustomRequest } from '../shared/types/CustomRequest';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user by admin.' })
  @ApiSuccessResponse(User, 'User created successfully.', HttpStatus.CREATED)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'User already exists', HttpStatus.BAD_REQUEST)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Post('/')
  public async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Omit<User, 'pass_hash'>>>> {
    return this.usersService.create(createUserDto, response);
  }

  @ApiOperation({ summary: 'Update user by ID.' })
  @ApiSuccessResponse(User, 'User updated successfully.', HttpStatus.OK)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'User to update not found.', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Put('/:id')
  public async updateById(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Omit<User, 'pass_hash'>>>> {
    return this.usersService.updateById(userId, updateUserDto, response);
  }

  @ApiOperation({ summary: 'Delete user by ID.' })
  @ApiSuccessResponse(
    AffectedResult,
    'User deleted successfully.',
    HttpStatus.OK,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'User to delete not found.', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Delete('/:id')
  public async deleteById(
    @Param('id') userId: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.usersService.deleteById(userId, response);
  }

  @ApiOperation({ summary: 'Get all users.' })
  @ApiOkResponsePaginated(User, 'Users retrieved successfully.', HttpStatus.OK)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiQuery({
    name: 'page',
    example: DEFAULT_PAGINATION_PAGE,
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    example: DEFAULT_PAGINATION_LIMIT,
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    enum: SortOrder,
    example: SortOrder.ASC,
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: USERS_SORT_KEYS,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'deletedAt',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'role',
    enum: UserRole,
    required: false,
    example: UserRole.USER,
  })
  @Get('/')
  public async getUsersPaginated(
    @Res() response: Response,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit?: number,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGINATION_PAGE), ParseIntPipe)
    page?: number,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
    @Query('deletedAt') deletedAt?: Date,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: SortOrder,
  ): Promise<Response<ItemsPaginated<Omit<User, 'pass_hash'>>>> {
    return this.usersService.getUsersPaginated(
      { page, limit, role, search, deletedAt, sortBy, sortOrder },
      response,
    );
  }

  @ApiOperation({ summary: 'Get user by ID from JWT strategy.' })
  @ApiSuccessResponse(User, 'User retrieved successfully.', HttpStatus.OK)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'User to get not found.', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @Get('/me')
  public async getMe(
    @Req() request: CustomRequest,
    @Res() response: Response,
  ): Promise<Response<Omit<User, 'pass_hash'>>> {
    const id = request?.user?.id;
    return this.usersService.getOneById(id, response);
  }
}
