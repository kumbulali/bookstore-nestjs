import { SetMetadata } from '@nestjs/common';

export const SUCCESS_MESSAGE = 'SUCCESS_MESSAGE';

export function SuccessMessage(message: string) {
  return SetMetadata(SUCCESS_MESSAGE, message);
}
