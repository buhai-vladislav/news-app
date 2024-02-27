import { Module } from '@nestjs/common';
import { PostsController } from 'src/controllers/Posts';
import { FilesService } from 'src/services/Files';
import { PostsService } from 'src/services/Posts';
import { PrismaService } from 'src/services/Prisma';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, FilesService],
  exports: [PostsService],
})
export class PostsModule {}
