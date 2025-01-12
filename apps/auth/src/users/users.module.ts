import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  Book,
  Bookstore,
  BOOKSTORE_SERVICE,
  DatabaseModule,
  LoggerModule,
  Role,
  RpcErrorInterceptor,
  User,
} from '@app/common';
import { UsersRepository } from './users.repository';
import { AdminSeederService } from './seeders/admin.seeder';
import { RolesRepository } from './roles.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RolesSeederService } from './seeders/roles.seeder';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User, Role, Bookstore, Book]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: BOOKSTORE_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: BOOKSTORE_SERVICE,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    RolesRepository,
    RolesSeederService,
    AdminSeederService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
