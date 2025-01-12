import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BookstoreIdDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  bookstoreId: number;
}
