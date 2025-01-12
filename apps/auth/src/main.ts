import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  TransformResponseInterceptor,
  TransformErrorResponseFilter,
  CustomValidationPipe,
  AUTH_SERVICE,
} from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: AUTH_SERVICE,
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
