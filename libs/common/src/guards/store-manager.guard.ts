import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookstore, Role, User } from '../models';
import { RolesEnum } from '../enums';

@Injectable()
export class StoreManagerGuard implements CanActivate {
  constructor(
    @InjectRepository(Bookstore)
    private readonly bookstoresRepository: Repository<Bookstore>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const bookstoreId = request.params.bookstoreId;

    if (!user) {
      throw new ForbiddenException('messages.UNAUTHORIZED');
    }

    if (!bookstoreId) {
      throw new ForbiddenException('messages.BOOKSTORE_REQUIRED');
    }

    if (
      !user.roles?.some((role: Role) => role.name === RolesEnum.STORE_MANAGER)
    ) {
      return true;
    }

    const bookstore = await this.bookstoresRepository.findOne({
      where: {
        id: bookstoreId,
      },
      relations: {
        managers: true,
      },
    });

    if (!bookstore.managers.some((manager: User) => manager.id === user.id))
      throw new ForbiddenException('messages.PERMISSION_DENIED');

    return true;
  }
}
