import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/App';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(AppModule.name);

  const port = parseInt(process.env.API_PORT) ?? 3000;
  logger.log(`Server started on port ${port}`);

  await app.listen(port);
}
bootstrap();
