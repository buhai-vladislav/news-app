import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './Prisma';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CronTasksService {
  private readonly logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {
    this.logger = new Logger(CronTasksService.name);
    this.logger.log('Cron tasks service initialized');

    this.logger.log(
      this.schedulerRegistry.doesExist('interval', 'handleExpiredTokens'),
    );
  }

  @Cron('0 0 * * *') // every day at 00:00
  async handleExpiredTokens() {
    try {
      const tokens = await this.prismaService.token.findMany({});

      const expiredTokens = tokens
        .map(({ token }) => {
          const payload = this.jwtService.verify(token, {
            ignoreExpiration: true,
            secret: process.env.ACCESS_TOKEN_SECRET || 'SECRET',
          });

          return payload.exp * 1000 <= Date.now() ? token : null;
        })
        .filter(Boolean);

      const result = await this.prismaService.token.deleteMany({
        where: { token: { in: expiredTokens } },
      });

      this.logger.log(`Deleted ${result.count} expired tokens.`);
    } catch (error) {
      this.logger.error(error?.message ?? error);
    }
  }
}
