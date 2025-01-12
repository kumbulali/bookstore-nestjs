import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookstoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
