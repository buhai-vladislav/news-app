import { Logger } from '@nestjs/common';
import { PrismaService } from '../../services/Prisma';
import * as Parser from 'rss-parser';
import { RssSource } from '@prisma/client';
import { SchedulerRegistry } from '@nestjs/schedule';
import { INTERVAL_RSS_PREFIX } from './constants';

export const rssParse = async (
  prismaService: PrismaService,
  rssSourceId: string,
) => {
  const logger = new Logger('RssParser');
  try {
    const rssSource = await prismaService.rssSource.findUnique({
      where: { id: rssSourceId },
    });

    if (!rssSource?.isStopped) {
      const parser = new Parser({
        customFields: { item: ['media:thumbnail'] },
      });
      const feed = await parser.parseURL(rssSource.source);

      //TODO: Add parsing and saving to database

      logger.log(`Rss source ${rssSourceId} parsed`);
    } else {
      logger.log('Rss source is stopped');
      return;
    }
  } catch (error) {
    logger.error(error);
  }
};

export const createInterval = (
  prismaService: PrismaService,
  schedulerRegistry: SchedulerRegistry,
  rssSource: RssSource,
) => {
  const intervalName = `${INTERVAL_RSS_PREFIX}${rssSource.id}`;
  if (!schedulerRegistry.doesExist('interval', intervalName)) {
    schedulerRegistry.addInterval(
      intervalName,
      setInterval(
        rssParse,
        rssSource.interval * 1000,
        prismaService,
        rssSource.id,
      ),
    );
  }
};

export const deleteInterval = (
  schedulerRegistry: SchedulerRegistry,
  rssSourceId: string,
) => {
  const intervalName = `${INTERVAL_RSS_PREFIX}${rssSourceId}`;
  if (schedulerRegistry.doesExist('interval', intervalName)) {
    schedulerRegistry.deleteInterval(intervalName);
  }
};
