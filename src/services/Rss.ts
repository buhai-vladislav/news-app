import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from './Prisma';
import { ResponseWrapper } from '../shared/utils/response';
import { CreateRssSourceDto, UpdateRssSourceDto } from '../dtos';
import {
  AffectedResult,
  CustomRequest,
  ResponseBody,
  RssFields,
} from '../shared/types';
import { createInterval, deleteInterval } from '../shared/utils/rssParse';
import { RssSource } from '@prisma/client';
import * as Parser from 'rss-parser';

@Injectable()
export class RssService {
  private readonly responseWrapper: ResponseWrapper;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.responseWrapper = new ResponseWrapper(RssService.name);
  }

  /**
   * Create a new RSS source.
   *
   * @param {CreateRssSourceDto} createRssSourceDto - the DTO for creating an RSS source
   * @param {Response} response - the HTTP response object
   * @param {CustomRequest} request - the custom HTTP request object
   * @return {Promise<any>} a Promise that resolves to the result of creating the RSS source
   */
  public async createRssSourse(
    createRssSourceDto: CreateRssSourceDto,
    response: Response,
    request: CustomRequest,
  ): Promise<Response<ResponseBody<RssSource>>> {
    try {
      const { id } = request.user;
      const { connections, ...rest } = createRssSourceDto;

      const source = await this.prismaService.rssSource.create({
        data: {
          ...rest,
          creator: { connect: { id } },
          connections: { create: connections },
        },
      });

      createInterval(this.prismaService, this.schedulerRegistry, source);

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.CREATED,
        'Rss source created',
        source,
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Update a RSS source.
   *
   * @param {string} rssSourceId - The ID of the RSS source
   * @param {UpdateRssSourceDto} updateRssSourseDto - The DTO containing the updated RSS source data
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<RssSource>>>} A promise that resolves to the updated RSS source
   */
  public async updateRssSource(
    rssSourceId: string,
    updateRssSourseDto: UpdateRssSourceDto,
    response: Response,
  ): Promise<Response<ResponseBody<RssSource>>> {
    try {
      const { connections, ...rest } = updateRssSourseDto;
      const source = await this.prismaService.rssSource.update({
        where: { id: rssSourceId },
        data: { ...rest },
      });

      if (!source) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Rss source not found',
        );
      }

      if (connections) {
        await this.prismaService.rssSource.update({
          where: { id: rssSourceId },
          data: {
            connections: {
              deleteMany: {},
              create: connections,
            },
          },
        });
      }

      if (rest?.isStopped !== undefined && rest?.isStopped) {
        deleteInterval(this.schedulerRegistry, rssSourceId);
      } else if (rest?.isStopped !== undefined && !rest?.isStopped) {
        createInterval(this.prismaService, this.schedulerRegistry, source);
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Rss source updated',
        source,
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * Delete a specific RSS source by ID.
   *
   * @param {string} rssSourceId - The ID of the RSS source to delete
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} A promise of the HTTP response with affected result
   */
  public async deleteRssSource(
    rssSourceId: string,
    response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const source = await this.prismaService.rssSource.delete({
        where: { id: rssSourceId },
      });

      if (!source) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Rss source not found',
        );
      }

      deleteInterval(this.schedulerRegistry, rssSourceId);

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Rss source deleted',
        { isAffected: true },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * A function to retrieve RSS sources.
   *
   * @param {Response} response - the HTTP response object
   * @param {CustomRequest} request - the custom request object
   * @param {string} [userId] - an optional user ID
   * @return {Promise<Response<ResponseBody<RssSource[]>>>} a Promise that resolves to nothing
   */
  public async getRssSources(
    response: Response,
    request: CustomRequest,
    userId?: string,
  ): Promise<Response<ResponseBody<RssSource[]>>> {
    try {
      const { id } = request.user;
      const sources = await this.prismaService.rssSource.findMany({
        where: { creatorId: userId ?? id },
      });

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Rss sources retrieved',
        sources,
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }

  /**
   * getRssFileFields retrieves the RSS file fields.
   *
   * @param {string} rssUrl - the URL of the RSS feed
   * @param {Response} response - the response object
   * @return {Promise<Response<ResponseBody<RssFields>>>} a Promise that resolves to nothing
   */
  public async getRssFileFields(
    rssUrl: string,
    response: Response,
  ): Promise<Response<ResponseBody<RssFields>>> {
    try {
      const parser = new Parser({
        customFields: { item: ['media:thumbnail'] },
      });
      const feed = await parser.parseURL(rssUrl);

      const { items, ...rest } = feed;

      const rootKeys = Object.keys(rest);
      const itemKeys = Object.keys(items[0]);

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Rss file fields retrieved',
        { rootKeys, itemKeys, rootValue: rest, itemValue: items[0] },
      );
    } catch (error) {
      return this.responseWrapper.sendError(
        response,
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal server error',
        error,
      );
    }
  }
}
