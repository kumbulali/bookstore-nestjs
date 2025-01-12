import { AbstractRepository } from '@app/common';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Bookstore } from '../../../libs/common/src/models/bookstores.entity';

@Injectable()
export class BookstoresRepository extends AbstractRepository<Bookstore> {
  protected readonly logger = new Logger(BookstoresRepository.name);

  constructor(
    @InjectRepository(Bookstore) bookstoresRepository: Repository<Bookstore>,
    entityManager: EntityManager,
  ) {
    super(bookstoresRepository, entityManager);
  }

  async findOne(
    findOptionsWhere: FindOptionsWhere<Bookstore>,
    relations?: FindOptionsRelations<Bookstore>,
  ): Promise<Bookstore> {
    const foundBookstore = await super.findOne(findOptionsWhere, relations);
    if (!foundBookstore)
      throw new NotFoundException('messages.BOOKSTORE_NOT_FOUND');

    return foundBookstore;
  }
}
