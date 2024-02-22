import { Module } from '@nestjs/common';
import { RssController } from '../controllers/Rss';
import { PrismaService } from '../services/Prisma';
import { RssService } from '../services/Rss';

@Module({
  providers: [RssService, PrismaService],
  controllers: [RssController],
  exports: [RssService],
})
export class RssModule {}
