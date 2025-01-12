import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const successMessage =
      this.reflector.get<string>('SUCCESS_MESSAGE', context.getHandler()) ||
      'messages.OPERATION_SUCCESSFUL';

    return next.handle().pipe(
      map((response) => {
        const hasAction =
          response && typeof response === 'object' && 'action' in response;
        return {
          success: true,
          message: this.i18n.translate(successMessage),
          action: hasAction ? response.action : undefined,
          data: !hasAction ? response : response.data,
        };
      }),
    );
  }
}
