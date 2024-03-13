import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/App';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JWT_BEARER_SWAGGER_AUTH_NAME } from './shared/utils/constants';
import { JwtAuthGuard } from './shared/guards/JwtAuthGuard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(AppModule.name);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('News Blog project API')
    .setDescription('The News Blog project API endpoints documentation.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      JWT_BEARER_SWAGGER_AUTH_NAME,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = parseInt(process.env.API_PORT) ?? 3000;
  logger.log(`Server started on port ${port}`);

  await app.listen(port);
}
bootstrap();
