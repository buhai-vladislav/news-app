import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/Auth';
import { AuthService } from '../services/Auth';
import { PrismaService } from '../services/Prisma';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}
