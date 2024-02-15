import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseBody } from '../types';

export const ApiSuccessResponse = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
  description: string,
  status: HttpStatus,
) =>
  applyDecorators(
    ApiExtraModels(ResponseBody, dataDto),
    ApiOkResponse({
      description,
      status,
      schema: {
        allOf: [
          {
            properties: {
              message: { type: 'string', example: description ?? 'Success' },
              status: { type: 'integer', example: status },
            },
          },
          {
            properties: {
              data: {
                $ref: getSchemaPath(dataDto),
              },
            },
          },
        ],
      },
    }),
  );