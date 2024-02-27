import { Module } from '@nestjs/common';
import { TagsContrroler } from 'src/controllers/Tags';
import { PrismaService } from 'src/services/Prisma';
import { TagsService } from 'src/services/Tags';

@Module({
  controllers: [TagsContrroler],
  providers: [TagsService, PrismaService],
  exports: [TagsService],
})
export class TagsModule {}
