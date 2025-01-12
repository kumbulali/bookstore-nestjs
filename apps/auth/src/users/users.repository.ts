import { AbstractRepository, Role, User } from '@app/common';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User) usersRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(usersRepository, entityManager);
  }

  async create(user: User): Promise<User> {
    try {
      return await super.create(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('messages.USER_ALREADY_EXISTS');
      }
      throw error;
    }
  }
}
