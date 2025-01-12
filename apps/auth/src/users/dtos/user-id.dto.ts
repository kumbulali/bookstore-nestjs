import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserIdDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  id: number;
}
