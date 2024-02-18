import { Module } from '@nestjs/common';
import { PrismaService } from '../services/Prisma';
import { UsersService } from '../services/Users';
import { UsersController } from '../controllers/Users';
import { MinioClientModule } from './MinIO';
import { FilesService } from 'src/services/Files';

@Module({
  imports: [MinioClientModule],
  providers: [UsersService, PrismaService, FilesService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
