import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import { WinstonModule } from 'nest-winston';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { winstonConfig } from '@common/configs/winston.config';
import { PrismaService } from '@common/services/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors({
    origin:
      configService.get('NODE_ENV') === 'development'
        ? '*'
        : [configService.get('FRONTEND_URL')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Compression
  app.use(compression());
  // Winston logger
  app.useLogger(WinstonModule.createLogger(winstonConfig));
  // Set global prefix for routes
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '^/images/.*',
        method: RequestMethod.ALL,
      },
    ],
  });
  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // Enable global validation request body data
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(3000);
}
bootstrap();
