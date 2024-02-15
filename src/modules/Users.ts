import { Module } from '@nestjs/common';
import { PrismaService } from '../services/Prisma';
import { UsersService } from '../services/Users';
import { UsersController } from '../controllers/Users';

@Module({
  imports: [],
  providers: [UsersService, PrismaService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
