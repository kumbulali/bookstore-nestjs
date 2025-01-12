import { NestFactory } from '@nestjs/core';
import { BookstoresModule } from './bookstores.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  BOOKSTORE_SERVICE,
  CustomValidationPipe,
  TransformErrorResponseFilter,
  TransformResponseInterceptor,
} from '@app/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(BookstoresModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: BOOKSTORE_SERVICE,
    },
  });
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalInterceptors(app.get(TransformResponseInterceptor));
  app.useGlobalFilters(app.get(TransformErrorResponseFilter));
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
