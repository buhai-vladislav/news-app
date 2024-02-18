import { Injectable } from '@nestjs/common';
import { PrismaService } from './Prisma';
import { MinioClientService } from './MinIO';
import { File, IBufferedFile } from '../shared/types';

@Injectable()
export class FilesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly minIOService: MinioClientService,
  ) {}

  /**
   * Uploads a single file to the server.
   *
   * @param {IBufferedFile} file - the file to be uploaded
   * @return {Promise<File>} the saved file object
   */
  async uploadSingle(file: IBufferedFile): Promise<File> {
    const { encoding, originalname, size, mimetype } = file;

    const fileSrc = await this.minIOService.upload(file);

    const savedFile = await this.prismaService.files.create({
      data: {
        name: originalname,
        encoding,
        mimetype,
        size,
        fileSrc,
      },
    });

    return savedFile;
  }

  /**
   * Uploads multiple files and returns the saved files.
   *
   * @param {IBufferedFile[]} files - array of files to be uploaded
   * @return {Promise<File[]>} array of saved files
   */
  async uploadMany(files: IBufferedFile[]): Promise<File[]> {
    const fileSrcs = await Promise.all(
      files.map(async (file) => {
        const fileSrc = await this.minIOService.upload(file);

        return { ...file, fileSrc };
      }),
    );

    const savedFiles = await Promise.all(
      fileSrcs.map(async (file) => {
        const { encoding, originalname, size, mimetype } = file;

        return await this.prismaService.files.create({
          data: {
            name: originalname,
            encoding,
            mimetype,
            size,
            fileSrc: file.fileSrc,
          },
        });
      }),
    );

    return savedFiles;
  }

  /**
   * Deletes multiple files by their IDs.
   *
   * @param {string[]} ids - Array of IDs of the files to be deleted
   * @return {Promise<boolean>} A Promise that resolves to a boolean indicating if all files were successfully deleted
   */
  async deleteMany(ids: string[]): Promise<boolean> {
    const files = await this.prismaService.files.findMany({
      where: { id: { in: ids } },
    });

    const deletedFiles = await Promise.all(
      files.map(async (file) => {
        await this.minIOService.delete(file.fileSrc);
        await this.prismaService.files.delete({ where: { id: file.id } });

        return true;
      }),
    );

    return deletedFiles.every((file) => file);
  }

  /**
   * Asynchronously deletes a single item.
   *
   * @param {string} id - the identifier of the item to be deleted
   * @return {Promise<boolean | null>} a promise that resolves to a boolean indicating the success of the deletion, or null if the item does not exist
   */
  async deleteSingle(id: string): Promise<boolean | null> {
    const file = await this.prismaService.files.findUnique({
      where: {
        id,
      },
    });

    if (!file) {
      return null;
    }

    await Promise.all([
      this.minIOService.delete(file.fileSrc),
      this.prismaService.files.delete({
        where: {
          id,
        },
      }),
    ]);

    return true;
  }

  /**
   * Retrieves the URL of an object from the specified file source.
   *
   * @param {string} fileSrc - the source of the file
   * @return {Promise<string>} the URL of the object
   */
  public async getObjectUrl(fileSrc: string): Promise<string> {
    return this.minIOService.getObjectUrl(fileSrc);
  }
}
