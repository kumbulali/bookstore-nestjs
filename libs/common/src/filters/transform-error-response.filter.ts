import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class TransformErrorResponseFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message = this.i18n.t('messages.INTERNAL_SERVER_ERROR');
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (
      typeof errorResponse === 'object' &&
      errorResponse !== null &&
      'message' in errorResponse
    ) {
      message = (errorResponse as any).message;
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message)
        ? message.map((m) => this.i18n.t(m))
        : this.i18n.t(message as string),
    });
  }
}
