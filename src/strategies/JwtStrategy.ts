import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from '../shared/types';
import { PrismaService } from '../services/Prisma';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'SECRET',
    });
  }

  async validate(payload: JWTPayload) {
    const { id } = payload;

    const response = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!response) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
