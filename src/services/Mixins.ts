import { Response } from 'express';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './Prisma';
import { ResponseWrapper } from '../shared/utils/response';
import {
  CreateMixinDto,
  CreateMixinSettingsDto,
  UpdateMixinDto,
  UpdateMixinSettingsDto,
} from '../dtos';
import {
  AffectedResult,
  ItemsPaginated,
  Mixin,
  MixinSetting,
  MixinsFindOptions,
  PaginationMeta,
  ResponseBody,
} from '../shared/types';
import { FilesService } from './Files';

@Injectable()
export class MixinsService {
  private readonly responseWrapper: ResponseWrapper;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FilesService,
  ) {
    this.responseWrapper = new ResponseWrapper(MixinsService.name);
  }

  /**
   * Create a new mixin using the provided data.
   *
   * @param {CreateMixinDto} createMixinDto - the data for creating the new mixin
   * @param {Response} response - the HTTP response object
   * @return {Promise<Response<ResponseBody<Mixin>>>} a promise that resolves when the operation is complete
   */
  public async create(
    createMixinDto: CreateMixinDto,
    response: Response,
  ): Promise<Response<ResponseBody<Mixin>>> {
    try {
      const { file, ...rest } = createMixinDto;

      let mixin = await this.prismaService.mixins.create({
        data: { ...rest },
        include: { media: true },
      });

      if (file) {
        const { id, name } = await this.fileService.uploadSingle(file);

        mixin = await this.prismaService.mixins.update({
          where: { id: mixin.id },
          data: { media: { connect: { id } } },
          include: { media: true },
        });

        const fileSrc = await this.fileService.getObjectUrl(name);

        mixin.media = { ...mixin.media, fileSrc };
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.CREATED,
        'Mixin created successfully',
        mixin,
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
   * Update a mixin by its ID with the provided data.
   *
   * @param {string} mixinId - The ID of the mixin to update
   * @param {UpdateMixinDto} updateMixinDto - The data to update the mixin with
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<Mixin>>>} The updated mixin response
   */
  public async update(
    mixinId: string,
    updateMixinDto: UpdateMixinDto,
    response: Response,
  ): Promise<Response<ResponseBody<Mixin>>> {
    try {
      const { file, ...rest } = updateMixinDto;

      let mixin = await this.prismaService.mixins.update({
        where: { id: mixinId },
        data: { ...rest },
        include: { media: true },
      });

      if (!mixin) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Mixin not found',
        );
      }

      if (file) {
        await this.fileService.deleteSingle(mixin.media.id);
        const { id, name } = await this.fileService.uploadSingle(file);

        mixin = await this.prismaService.mixins.update({
          where: { id: mixin.id },
          data: { media: { delete: {}, connect: { id } } },
          include: { media: true },
        });

        const fileSrc = await this.fileService.getObjectUrl(name);

        mixin.media = { ...mixin.media, fileSrc };
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Mixin updated successfully',
        mixin,
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
   * Deletes a mixin by its ID and associated media, and returns the affected result.
   *
   * @param {string} mixinId - The ID of the mixin to be deleted
   * @param {Response} response - The response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} A promise that resolves to the response with the affected result
   */
  public async delete(
    mixinId: string,
    response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const mixin = await this.prismaService.mixins.delete({
        where: { id: mixinId },
        include: { media: true },
      });

      if (!mixin) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Mixin not found',
        );
      }

      await this.fileService.deleteSingle(mixin.media.id);

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Mixin deleted successfully',
        { isAffected: !!mixin },
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
   * Retrieves a Mixin by ID.
   *
   * @param {string} mixinId - the ID of the Mixin to retrieve
   * @param {Response} response - the HTTP response object
   * @return {Promise<Response<ResponseBody<Mixin>>>} a Promise that resolves to the retrieved Mixin response
   */
  public async getById(
    mixinId: string,
    response: Response,
  ): Promise<Response<ResponseBody<Mixin>>> {
    try {
      const mixin = await this.prismaService.mixins.findUnique({
        where: { id: mixinId },
        include: { media: true },
      });

      if (!mixin) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Mixin not found',
        );
      }

      if (mixin.media) {
        mixin.media.fileSrc = await this.fileService.getObjectUrl(
          mixin.media.name,
        );
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Mixin retrieved successfully',
        mixin,
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
   * Retrieves multiple items based on the given options and response.
   *
   * @param {MixinsFindOptions} options - The options for finding the items.
   * @param {Response} response - The response object to send the result.
   * @return {Promise<Response<ResponseBody<ItemsPaginated<Mixin>>>} The response containing the paginated items.
   */
  public async getPaginated(
    options: MixinsFindOptions,
    response: Response,
  ): Promise<Response<ResponseBody<ItemsPaginated<Mixin>>>> {
    try {
      const { limit, page } = options;
      const skip = (page - 1) * limit;
      const where = this.createGetMixinsWhereOptions(options);

      const [count, mixins] = await Promise.all([
        this.prismaService.mixins.count({ where }),
        this.prismaService.mixins.findMany({
          skip,
          take: limit,
          where,
          include: { media: true },
        }),
      ]);

      const totalPages = Math.ceil(count / limit);
      const pagination: PaginationMeta = {
        count,
        limit,
        page,
        totalPages,
      };

      const items = await Promise.all(
        mixins.map(async (mixin) => {
          if (mixin?.media) {
            mixin.media.fileSrc = await this.fileService.getObjectUrl(
              mixin.media.name,
            );
          }

          return mixin;
        }),
      );

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Mixins retrieved successfully',
        { items, pagination },
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
   * Create Get Mixins Where Options
   *
   * @param {MixinsFindOptions} options - options for finding mixins
   * @return {Prisma.MixinsWhereInput} the where input for mixins
   */
  private createGetMixinsWhereOptions(
    options: MixinsFindOptions,
  ): Prisma.MixinsWhereInput {
    const where: Prisma.MixinsWhereInput = {};

    if (options.concatTypes) {
      where.concatTypes = { hasSome: options.concatTypes };
    }

    if (options.type) {
      where.type = { equals: options.type };
    }

    if (options.status) {
      where.status = { equals: options.status };
    }

    return where;
  }

  /**
   * Create a new setting using the provided data.
   *
   * @param {CreateMixinSettingsDto} createMixinSettingDto - the data to create the setting
   * @param {Response} response - the HTTP response object
   * @return {Promise<Response<ResponseBody<MixinSetting>>>} a promise that resolves to the HTTP response with the created setting
   */
  public async createSetting(
    createMixinSettingDto: CreateMixinSettingsDto,
    response: Response,
  ): Promise<Response<ResponseBody<MixinSetting>>> {
    try {
      const setting = await this.prismaService.mixinsSettings.create({
        data: createMixinSettingDto,
      });

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.CREATED,
        'Setting created successfully',
        setting,
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
   * Update a setting by settingId with the provided data.
   *
   * @param {string} settingId - The ID of the setting to update
   * @param {UpdateMixinSettingsDto} updateMixinSettingDto - The data to update the setting with
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<MixinSetting>>>} A promise that resolves to the updated setting response
   */
  public async updateSetting(
    settingId: string,
    updateMixinSettingDto: UpdateMixinSettingsDto,
    response: Response,
  ): Promise<Response<ResponseBody<MixinSetting>>> {
    try {
      const setting = await this.prismaService.mixinsSettings.update({
        where: { id: settingId },
        data: updateMixinSettingDto,
      });

      if (!setting) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Setting not found',
        );
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Setting updated successfully',
        setting,
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
   * Delete a setting by its ID.
   *
   * @param {string} settingId - The ID of the setting to be deleted
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<AffectedResult>>>} A promise that resolves to the HTTP response with affected result
   */
  public async deleteSetting(
    settingId: string,
    response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    try {
      const setting = await this.prismaService.mixinsSettings.delete({
        where: { id: settingId },
      });

      if (!setting) {
        return this.responseWrapper.sendError(
          response,
          HttpStatus.NOT_FOUND,
          'Setting not found',
        );
      }

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Setting deleted successfully',
        { isAffected: !!setting },
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
   * Retrieves all settings from the database and sends a success response with the retrieved settings, or an error response if an error occurs.
   *
   * @param {Response} response - The HTTP response object
   * @return {Promise<Response<ResponseBody<Array<MixinSetting>>>>} The HTTP response with the retrieved settings
   */
  public async getAllSettings(
    response: Response,
  ): Promise<Response<ResponseBody<Array<MixinSetting>>>> {
    try {
      const settings = await this.prismaService.mixinsSettings.findMany();

      return this.responseWrapper.sendSuccess(
        response,
        HttpStatus.OK,
        'Settings retrieved successfully',
        settings,
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
