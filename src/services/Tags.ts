import { CreateTagsDto, UpdateTagsDto } from 'src/dtos';
import { ResponseWrapper } from '../shared/utils/response';
import { PrismaService } from './Prisma';
import { Response } from 'express';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AffectedResult, ResponseBody, Tag } from 'src/shared/types';

@Injectable()
export class TagsService {
  private readonly responseWrapper: ResponseWrapper;
  constructor(private readonly prismaService: PrismaService) {
    this.responseWrapper = new ResponseWrapper(TagsService.name);
  }

  /**
   * A function to create multiple tags.
   *
   * @param {CreateTagsDto} createTagsDto - the data transfer object for creating tags
   * @param {Response} response - the response object
   * @return {Promise<Response<ResponseBody<Tag[]>>>} a promise that resolves to the result of creating multiple tags
   */
  public async createMany(
    createTagsDto: CreateTagsDto,
    response: Response,
  ): Promise<Response<ResponseBody<Tag[]>>> {
    try {
      const { tags } = createTagsDto;

      const createdTags = await Promise.all(
        tags.map(
          async (tag) =>
            await this.prismaService.tags.create({
              data: { name: tag },
            }),
        ),
      );

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.CREATED,
        'Tags created',
        createdTags,
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
   * Update multiple tags.
   *
   * @param {UpdateTagsDto} updateTagsDto - the data to update the tags
   * @param {Response} response - the response object
   * @return {Promise<Response<ResponseBody<Tag[]>>} a promise of a response with an array of tags
   */
  public async updateMany(
    updateTagsDto: UpdateTagsDto,
    response: Response,
  ): Promise<Response<ResponseBody<Tag[]>>> {
    try {
      const { tags } = updateTagsDto;

      const updatedTags = await Promise.all(
        tags.map(async (tag) => {
          const updated = await this.prismaService.tags.update({
            where: { id: tag.id },
            data: { name: tag.name },
          });

          if (!updated) {
            throw new Error(`Tag ${tag.id} not found`);
          }

          return updated;
        }),
      );

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Tags updated',
        updatedTags,
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
   * Delete multiple records based on the provided IDs.
   *
   * @param {string[]} ids - An array of IDs to be deleted
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} A promise that resolves to a response containing the affected result
   */
  public async deleteMany(
    ids: string[],
    response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const deletedTags = await this.prismaService.tags.deleteMany({
        where: { id: { in: ids } },
      });

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Tags deleted',
        { isAffected: !!deletedTags.count },
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
   * Function to retrieve tags from the prisma service and send the response using the responseWrapper.
   *
   * @param {Response} response - the HTTP response object
   * @return {Promise<Response<ResponseBody<Tag[]>>>} a promise that resolves to the result of sending the success or error response
   */
  public async getTags(
    response: Response,
  ): Promise<Response<ResponseBody<Tag[]>>> {
    try {
      const tags = await this.prismaService.tags.findMany();

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Tags retrieved',
        tags,
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
