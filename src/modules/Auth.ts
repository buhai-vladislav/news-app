import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from '../controllers/Auth';
import { AuthService } from '../services/Auth';
import { PrismaService } from '../services/Prisma';
import { MinioClientModule } from './MinIO';
import { FilesService } from '../services/Files';
import { JwtStrategy } from '../strategies/JwtStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MinioClientModule,
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET') || 'SECRET',
        signOptions: {
          expiresIn: configService.get('ACCESS_TOKEN_EXPIRATION_TIME') || '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    JwtService,
    FilesService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
