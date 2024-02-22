import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RssService } from '../services/Rss';
import { CreateRssSourceDto } from '../dtos';
import {
  AffectedResult,
  CustomRequest,
  ResponseBody,
  RssFields,
  User,
} from '../shared/types';
import { JWT_BEARER_SWAGGER_AUTH_NAME } from '../shared/utils/constants';
import { ApiSuccessResponse, ApiErrorResponse } from '../shared/decorators';
import { RssSource as SwaggerRssSource } from '../shared/types/RssSource';
import type { RssSource } from '@prisma/client';

@ApiTags('Rss')
@Controller('/rss')
export class RssController {
  constructor(private readonly rssService: RssService) {}

  @ApiOperation({ summary: 'Create RSS sources' })
  @ApiSuccessResponse(
    SwaggerRssSource,
    'Rss source created',
    HttpStatus.CREATED,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Post('/source')
  public async createRssSourse(
    @Body() createRssSourseDto: CreateRssSourceDto,
    @Res() response: Response,
    @Req() request: CustomRequest,
  ) {
    return this.rssService.createRssSourse(
      createRssSourseDto,
      response,
      request,
    );
  }

  @ApiOperation({ summary: 'Update RSS sources' })
  @ApiSuccessResponse(SwaggerRssSource, 'Rss source updated', HttpStatus.OK)
  @ApiErrorResponse(String, 'Rss source not found', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Put('/source/:rssSourceId')
  public async updateRssSource(
    @Param('rssSourceId') rssSourceId: string,
    @Body() updateRssSourseDto: CreateRssSourceDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<RssSource>>> {
    return this.rssService.updateRssSource(
      rssSourceId,
      updateRssSourseDto,
      response,
    );
  }

  @ApiOperation({ summary: 'Delete RSS source by ID' })
  @ApiSuccessResponse(AffectedResult, 'Rss source deleted', HttpStatus.OK)
  @ApiErrorResponse(String, 'Rss source not found', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Delete('/source/:rssSourceId')
  public async deleteRssSource(
    @Param('rssSourceId') rssSourceId: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.rssService.deleteRssSource(rssSourceId, response);
  }

  @ApiOperation({ summary: 'Get RSS sources by user id' })
  @ApiSuccessResponse(SwaggerRssSource, 'Rss sources retrieved', HttpStatus.OK)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'Rss source not found', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiQuery({
    name: 'userId',
    type: String,
    required: false,
    description: 'User ID',
  })
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('/sources')
  public async getRssSources(
    @Res() response: Response,
    @Req() request: CustomRequest,
    @Query('userId') userId?: string,
  ): Promise<Response<ResponseBody<RssSource[]>>> {
    return this.rssService.getRssSources(response, request, userId);
  }

  @ApiOperation({ summary: 'Get RSS file fields' })
  @ApiSuccessResponse(RssFields, 'Rss file fields retrieved', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Internal server error.',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiQuery({ name: 'rssUrl', type: String, required: true })
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('/file-fields')
  public async getRssFileFields(
    @Query('rssUrl') rssUrl: string,
    @Res() response: Response,
  ) {
    return this.rssService.getRssFileFields(rssUrl, response);
  }
}
