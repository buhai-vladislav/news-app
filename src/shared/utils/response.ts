import { Logger } from '@nestjs/common';
import { Response } from 'express';

export class ResponseWrapper {
  private readonly logger: Logger;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  public sendSuccess(
    response: Response,
    status: number,
    message: string,
    data?: any,
  ) {
    return response.status(status).json({ message, status, data });
  }

  public sendError(
    response: Response,
    status: number,
    message: string,
    error?: any,
  ) {
    this.logger.error(error);
    return response.status(status).json({ message, status, error });
  }
}
