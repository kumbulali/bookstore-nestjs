import {
  Injectable,
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const i18n = I18nContext.current();
        const messages = CustomValidationPipe.flattenValidationErrors(
          validationErrors,
          i18n,
        );
        return new BadRequestException(messages);
      },
    });
  }

  private static flattenValidationErrors(
    errors: ValidationError[],
    i18n: I18nContext,
  ): string[] {
    const messages: string[] = [];
    for (const error of errors) {
      if (error.children && error.children.length > 0) {
        messages.push(
          ...CustomValidationPipe.flattenValidationErrors(error.children, i18n),
        );
      }

      if (error.constraints) {
        for (const [constraintKey, message] of Object.entries(
          error.constraints,
        )) {
          if (constraintKey && constraintKey !== 'matches') {
            messages.push(
              i18n.translate(`validations.${constraintKey}`, {
                args: { property: error.property },
              }),
            );
          } else {
            messages.push(message);
          }
        }
      }
    }
    return messages;
  }
}
