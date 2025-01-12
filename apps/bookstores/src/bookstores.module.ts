import { Module } from '@nestjs/common';
import { BookstoresController } from './bookstores.controller';
import { BookstoresService } from './bookstores.service';
import {
  AUTH_SERVICE,
  Bookstore,
  DatabaseModule,
  getI18nPath,
  HealthModule,
  LoggerModule,
  Role,
  TransformErrorResponseFilter,
  TransformResponseInterceptor,
  User,
} from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import { BooksModule } from './books/books.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookstoresRepository } from './bookstores.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Bookstore, User, Role]),
    BooksModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000).required(),
        RABBITMQ_URI: Joi.string().required(),
      }),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: getI18nPath(),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    HealthModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: AUTH_SERVICE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BookstoresController],
  providers: [
    BookstoresService,
    BookstoresRepository,
    TransformResponseInterceptor,
    TransformErrorResponseFilter,
  ],
})
export class BookstoresModule {}
