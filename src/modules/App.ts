import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './Users';
import { AuthModule } from './Auth';
import { CronTasksService } from '../services/CronTasks';
import { ScheduleModule } from '@nestjs/schedule';
import { RssModule } from './Rss';
import { TagsModule } from './Tags';
import { PostsModule } from './Posts';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    ScheduleModule.forRoot(),
    RssModule,
    TagsModule,
    PostsModule,
  ],
  controllers: [],
  providers: [CronTasksService],
})
export class AppModule {}
