import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateTagsDto, UpdateTagsDto } from 'src/dtos';
import { TagsService } from 'src/services/Tags';
import { ApiErrorResponse, ApiSuccessResponse } from 'src/shared/decorators';
import { AffectedResult, ResponseBody, Tag } from 'src/shared/types';
import { JWT_BEARER_SWAGGER_AUTH_NAME } from 'src/shared/utils/constants';

@ApiTags('Tags')
@Controller('tags')
export class TagsContrroler {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Create multiple tags',
  })
  @ApiSuccessResponse(Tag, 'Tag created', HttpStatus.CREATED, true)
  @ApiErrorResponse(
    String,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Post('/')
  public async createMany(
    @Body() createTagsDto: CreateTagsDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Tag[]>>> {
    return this.tagsService.createMany(createTagsDto, response);
  }

  @ApiOperation({
    summary: 'Update multiple tags',
  })
  @ApiSuccessResponse(AffectedResult, 'Tags updated', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiQuery({
    name: 'ids',
    required: true,
    type: String,
    description: 'IDs separated by comma',
  })
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Delete('/')
  public async deleteMany(
    @Query('ids', new ParseArrayPipe({ items: String, separator: ',' }))
    ids: string[],
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.tagsService.deleteMany(ids, response);
  }

  @ApiOperation({
    summary: 'Update multiple tags',
  })
  @ApiSuccessResponse(Tag, 'Tags updated', HttpStatus.OK, true)
  @ApiErrorResponse(
    String,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Put('/')
  public async updateMany(
    @Body() updateTagsDto: UpdateTagsDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Tag[]>>> {
    return this.tagsService.updateMany(updateTagsDto, response);
  }

  @ApiOperation({
    summary: 'Get all tags',
  })
  @ApiSuccessResponse(Tag, 'Tags retrieved', HttpStatus.OK, true)
  @ApiErrorResponse(
    String,
    'Internal server error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('/')
  public async getTags(
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Tag[]>>> {
    return this.tagsService.getTags(response);
  }
}
