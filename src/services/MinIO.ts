import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import * as crypto from 'crypto';

import { FileTypes, IBufferedFile } from '../shared/types';
import { setUpBucket } from '../shared/utils/minio';

@Injectable()
export class MinioClientService {
  constructor(private readonly minio: MinioService) {
    setUpBucket(minio);
  }
  private readonly bucketName = process.env.MINIO_BUCKET_NAME;

  /**
   * Perform an upload operation with the given file to the specified bucket.
   *
   * @param {IBufferedFile} file - The file to be uploaded
   * @param {string} [bucketName=this.bucketName] - The name of the bucket where the file will be uploaded
   * @return {Promise<string>} The name of the uploaded file
   */
  public async upload(
    file: IBufferedFile,
    bucketName: string = this.bucketName,
  ): Promise<string> {
    const { buffer, mimetype, originalname } = file;

    if (!FileTypes.some((type) => type === mimetype)) {
      throw new BadRequestException('File type not supported!');
    }

    const timestamp = Date.now().toString();

    const hashedFileName = crypto
      .createHash('md5')
      .update(timestamp)
      .digest('hex');
    const extension = originalname.substring(
      originalname.lastIndexOf('.'),
      originalname.length,
    );

    const metaData = {
      'Content-Type': file.mimetype,
    };
    const fileName = hashedFileName + extension;

    await this.minio.client.putObject(bucketName, fileName, buffer, metaData);

    return fileName;
  }

  /**
   * Asynchronously deletes an object from the specified bucket.
   *
   * @param {string} objectName - the name of the object to delete
   * @param {string} [bucketName=this.bucketName] - the name of the bucket from which to delete the object
   * @return {Promise<void>} a promise that resolves when the object is successfully deleted
   */
  async delete(
    objectName: string,
    bucketName: string = this.bucketName,
  ): Promise<void> {
    await this.minio.client.removeObject(bucketName, objectName);
  }

  /**
   * Retrieves a presigned URL for the specified object in the bucket.
   *
   * @param {string} objectName - The name of the object to retrieve.
   * @param {string} [bucketName=this.bucketName] - The name of the bucket where the object is stored.
   * @param {number} [expiresIn=24 * 60 * 60] - The expiration time for the presigned URL in seconds. Defaults to 1 day.
   * @return {Promise<string>} The presigned URL for the specified object.
   */
  public async getObjectUrl(
    objectName: string,
    bucketName: string = this.bucketName,
    expiresIn: number = 24 * 60 * 60, // 1 day
  ): Promise<string> {
    return this.minio.client.presignedGetObject(
      bucketName,
      objectName,
      expiresIn,
    );
  }
}
