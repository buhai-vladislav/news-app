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
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { MixinsService } from '../services/Mixins';
import {
  CreateMixinDto,
  CreateMixinSettingsDto,
  UpdateMixinDto,
  UpdateMixinSettingsDto,
} from '../dtos';
import {
  AffectedResult,
  IBufferedFile,
  ItemsPaginated,
  Mixin,
  MixinSetting,
  ResponseBody,
  SortOrder,
} from '../shared/types';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  JWT_BEARER_SWAGGER_AUTH_NAME,
  MIXINS_SORT_KEYS,
} from '../shared/utils/constants';
import {
  ApiErrorResponse,
  ApiSuccessPaginatedResponse,
  ApiSuccessResponse,
} from '../shared/decorators';
import {
  CreateMixinSchema,
  UpdateMixinSchema,
} from '../shared/swagger/schemas';
import { FileInterceptor } from '@nestjs/platform-express';
import { MixinConcatType, MixinStatus, MixinType } from '@prisma/client';

@ApiTags('Mixins')
@Controller('mixins')
export class MixinsController {
  constructor(private readonly mixinsService: MixinsService) {}

  @ApiOperation({ summary: 'Create new mixin' })
  @ApiSuccessResponse(Mixin, 'Created new mixin', HttpStatus.CREATED)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(CreateMixinSchema)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Post('/')
  public async create(
    @Body() createMixinDto: CreateMixinDto,
    @Res() response: Response,
    @UploadedFile() file?: IBufferedFile,
  ): Promise<Response<ResponseBody<Mixin>>> {
    return this.mixinsService.create(createMixinDto, response);
  }

  @ApiOperation({ summary: 'Update mixin by ID' })
  @ApiSuccessResponse(Mixin, 'Updated mixin', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'Mixin not found', HttpStatus.NOT_FOUND)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody(UpdateMixinSchema)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Put('/:id')
  public async update(
    @Body() updateMixinDto: UpdateMixinDto,
    @Param('id') id: string,
    @Res() response: Response,
    @UploadedFile() file?: IBufferedFile,
  ): Promise<Response<ResponseBody<Mixin>>> {
    return this.mixinsService.update(id, updateMixinDto, response);
  }

  @ApiOperation({ summary: 'Get mixin by ID' })
  @ApiSuccessResponse(Mixin, 'Retrieved mixin', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Mixin not found', HttpStatus.NOT_FOUND)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('/:id')
  public async getById(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Mixin>>> {
    return this.mixinsService.getById(id, response);
  }

  @ApiOperation({ summary: 'Delete mixin by ID' })
  @ApiSuccessResponse(AffectedResult, 'Deleted mixin', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Mixin not found', HttpStatus.NOT_FOUND)
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Delete('/:id')
  public async delete(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.mixinsService.delete(id, response);
  }

  @ApiOperation({ summary: 'Get paginated mixins' })
  @ApiSuccessPaginatedResponse(Mixin, 'Retrieved mixins', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiQuery({
    name: 'type',
    enum: MixinType,
    required: false,
  })
  @ApiQuery({
    name: 'concatTypes',
    required: false,
    isArray: true,
    enum: MixinConcatType,
  })
  @ApiQuery({
    name: 'status',
    enum: MixinStatus,
    required: false,
  })
  @ApiQuery({
    name: 'sortBy',
    enum: MIXINS_SORT_KEYS,
    required: false,
  })
  @ApiQuery({
    name: 'sortOrder',
    enum: SortOrder,
    required: false,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('/')
  public async getPaginated(
    @Res() response: Response,
    @Query('page', new DefaultValuePipe(DEFAULT_PAGINATION_PAGE), ParseIntPipe)
    page: number,
    @Query(
      'limit',
      new DefaultValuePipe(DEFAULT_PAGINATION_LIMIT),
      ParseIntPipe,
    )
    limit: number,
    @Query('type') type?: MixinType,
    @Query('concatTypes', new ParseArrayPipe({ items: String, separator: ',' }))
    concatTypes?: MixinConcatType[],
    @Query('status') status?: MixinStatus,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: SortOrder,
  ): Promise<Response<ResponseBody<ItemsPaginated<Mixin>>>> {
    return this.mixinsService.getPaginated(
      { page, limit, type, concatTypes, status, sortBy, sortOrder },
      response,
    );
  }

  @ApiOperation({ summary: 'Create mixin setting' })
  @ApiSuccessResponse(MixinSetting, 'Created mixin setting', HttpStatus.CREATED)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Post('/settings')
  public async createSetting(
    @Body() createMixinSettingDto: CreateMixinSettingsDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<MixinSetting>>> {
    return this.mixinsService.createSetting(createMixinSettingDto, response);
  }

  @ApiOperation({ summary: 'Get all mixin settings' })
  @ApiSuccessResponse(
    MixinSetting,
    'Retrieved mixin settings',
    HttpStatus.OK,
    true,
  )
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Get('/settings')
  public async getSettings(
    @Res() response: Response,
  ): Promise<Response<ResponseBody<Array<MixinSetting>>>> {
    return this.mixinsService.getAllSettings(response);
  }

  @ApiOperation({ summary: 'Update mixin setting by ID' })
  @ApiSuccessResponse(MixinSetting, 'Updated mixin setting', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'Setting not found', HttpStatus.NOT_FOUND)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Put('/settings/:id')
  public async updateSetting(
    @Param('id') id: string,
    @Body() updateMixinSettingsDto: UpdateMixinSettingsDto,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<MixinSetting>>> {
    return this.mixinsService.updateSetting(
      id,
      updateMixinSettingsDto,
      response,
    );
  }

  @ApiOperation({ summary: 'Delete mixin setting by ID' })
  @ApiSuccessResponse(MixinSetting, 'Deleted mixin setting', HttpStatus.OK)
  @ApiErrorResponse(
    String,
    'Something went wrong',
    HttpStatus.INTERNAL_SERVER_ERROR,
  )
  @ApiErrorResponse(String, 'Unauthorized', HttpStatus.UNAUTHORIZED)
  @ApiErrorResponse(String, 'Setting not found', HttpStatus.NOT_FOUND)
  @ApiBearerAuth(JWT_BEARER_SWAGGER_AUTH_NAME)
  @Delete('/settings/:id')
  public async deleteSetting(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response<ResponseBody<AffectedResult>>> {
    return this.mixinsService.deleteSetting(id, response);
  }
}
