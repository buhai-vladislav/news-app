import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MixinConcatType, PostStatus } from '@prisma/client';
import { Response } from 'express';
import { CreatePostDto, UpdatePostDto } from '../dtos';
import { PostsService } from '../services/Posts';
import { PublicRoute } from '../shared/guards/PublicRoute';
import {
  AffectedResult,
  CustomRequest,
  IBufferedFile,
  ItemsPaginated,
  PostSearch,
  Post as PostType,
  PostsFindOptions,
  ResponseBody,
  SortOrder,
} from '../shared/types';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  JWT_BEARER_SWAGGER_AUTH_NAME,
  POSTS_SORT_KEYS,
} from '../shared/utils/constants';
import {
  ApiErrorResponse,
  ApiSuccessPaginatedResponse,
  ApiSuccessResponse,
} from '../shared/decorators';
import {
  CreatePostSchema,
  UpdatePostMediaSchema,
  UpdatePostSchema,
} from '../shared/swagger/schemas';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create post' })
  @ApiSuccessResponse(PostType, 'Post created', HttpStatus.CREATED)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiConsumes('multipart/form-data')
  @ApiBody(CreatePostSchema)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @UseInterceptors(FilesInterceptor('files'))
  @Post('/')
  public async createPost(
    @Body() createPostDto: CreatePostDto,
    @Res() response: Response,
    @Req() request: CustomRequest,
    @UploadedFiles() files?: IBufferedFile[],
  ): Promise<Response<ResponseBody<PostType>>> {
    return this.postsService.createPost(
      createPostDto,
      response,
      request,
      files,
    );
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiSuccessResponse(PostType, 'Post updated', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiConsumes('multipart/form-data')
  @ApiBody(UpdatePostSchema)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Put('/:postId')
  public async updatePost(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Res() response: Response,
    @UploadedFiles() files?: IBufferedFile[],
  ): Promise<Response<ResponseBody<PostType>>> {
    return this.postsService.updatePost(postId, updatePostDto, response, files);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiSuccessResponse(AffectedResult, 'Post deleted', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Delete('/:postId')
  public async deletePost(
    @Param('postId') postId: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.postsService.deletePost(postId, response);
  }

  @ApiOperation({ summary: 'Update post media' })
  @ApiSuccessResponse(AffectedResult, 'Post media updated', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiConsumes('multipart/form-data')
  @ApiBody(UpdatePostMediaSchema)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Post('/:postId/media')
  public async updatePostMedia(
    @Param('postId') postId: string,
    @Res() response: Response,
    @UploadedFile() file: IBufferedFile,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.postsService.changePostMedia(postId, file, response);
  }

  @ApiOperation({ summary: 'Search posts' })
  @ApiSuccessResponse(PostSearch, 'Posts retrieved', HttpStatus.OK, true)
  @ApiErrorResponse(
    String,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiQuery({
    name: 'query',
    type: String,
    required: false,
    description: 'Search query',
  })
  @PublicRoute()
  @Get('/search')
  public async getSearchPosts(
    @Query('query') query: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Array<PostSearch>>>> {
    return this.postsService.searchPosts(query, response);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiSuccessResponse(PostType, 'Post retrieved', HttpStatus.OK)
  @ApiErrorResponse(String, 'Post not found', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(
    String,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @PublicRoute()
  @Get('/:postId')
  public async getPostById(
    @Param('postId') postId: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<PostType>>> {
    return this.postsService.getPostById(postId, response);
  }

  @ApiOperation({ summary: 'Get posts' })
  @ApiSuccessPaginatedResponse(PostType, 'Posts retrieved', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search query',
  })
  @ApiQuery({
    name: 'sortBy',
    enum: POSTS_SORT_KEYS,
    example: POSTS_SORT_KEYS[0],
    required: false,
    description: 'Sort by field',
  })
  @ApiQuery({
    name: 'sortOrder',
    enum: SortOrder,
    required: false,
    example: SortOrder.ASC,
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'status',
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
    required: false,
    description: 'Post status',
  })
  @ApiQuery({
    name: 'creatorId',
    type: String,
    required: false,
    description: 'Post creator id',
  })
  @ApiQuery({
    name: 'tags',
    type: String,
    required: false,
    description: 'Post tags',
    example: 'tag1ID,tag2Id',
  })
  @ApiQuery({
    name: 'mixinConcatType',
    enum: MixinConcatType,
    example: MixinConcatType.PAGINATION,
    required: false,
    description: 'Post mixin concat type',
  })
  @PublicRoute()
  @Get('/')
  public async getPosts(
    @Query('page', new DefaultValuePipe(DEFAULT_PAGINATION_PAGE), ParseIntPipe)
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
    @Res() response: Response,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: SortOrder,
    @Query('status') status?: PostStatus,
    @Query('creatorId') creatorId?: string,
    @Query('mixinConcatType') mixinConcatType?: MixinConcatType,
    @Query('tags', new ParseArrayPipe({ items: String, separator: ',' }))
    tags?: string[],
  ): Promise<Response<ResponseBody<ItemsPaginated<PostType>>>> {
    const whereOptions = {
      limit,
      page,
      search,
      sortBy,
      sortOrder,
      status,
      tags,
      creatorId,
      mixinConcatType,
    } as PostsFindOptions;

    return this.postsService.getPosts(whereOptions, response);
  }
}
