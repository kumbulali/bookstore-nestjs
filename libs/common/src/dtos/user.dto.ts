import { Role } from '../models';

export interface UserDto {
  id: number;
  email: string;
  roles?: Role[];
}
