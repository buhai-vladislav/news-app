import { Module } from '@nestjs/common';
import { MixinsController } from 'src/controllers/Mixins';
import { FilesService } from 'src/services/Files';
import { MixinsService } from 'src/services/Mixins';
import { PrismaService } from 'src/services/Prisma';

@Module({
  controllers: [MixinsController],
  providers: [FilesService, PrismaService, MixinsService],
  exports: [MixinsService],
})
export class MixinsModule {}
