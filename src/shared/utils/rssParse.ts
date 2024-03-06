import { Logger } from '@nestjs/common';
import { PrismaService } from '../../services/Prisma';
import * as Parser from 'rss-parser';
import { SchedulerRegistry } from '@nestjs/schedule';
import { INTERVAL_RSS_PREFIX } from './constants';
import { RssSource } from '../types';
import { Prisma } from '@prisma/client';

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
      const parsed = await parseRssAndSave(rssSource, prismaService);
      logger.log(
        `Rss source ${rssSourceId} parsed and saved ${parsed.count} posts`,
      );
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

export const parseRssAndSave = async (
  rssSource: RssSource,
  prismaService: PrismaService,
): Promise<Prisma.BatchPayload> => {
  const parser = new Parser({
    customFields: { item: ['media:thumbnail'] },
  });
  const feed = await parser.parseURL(rssSource.source);

  const postsDatas = feed.items.map((item) => {
    const postData = rssSource.connections.reduce((acc, connection) => {
      acc[connection.internal] = item[connection.external];
      return acc;
    }, {} as Prisma.PostsCreateInput);

    return postData;
  });

  const result = await prismaService.posts.createMany({
    data: postsDatas,
    skipDuplicates: true,
  });

  return result;
};
