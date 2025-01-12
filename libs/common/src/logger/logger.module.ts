import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { skip } from 'rxjs';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        customLogLevel: (req, res, err) => {
          if (req.url === '/' && req.method === 'GET') return 'silent';
          return 'info';
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
