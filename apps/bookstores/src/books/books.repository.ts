import { AbstractRepository, Book } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class BooksRepository extends AbstractRepository<Book> {
  protected readonly logger = new Logger(BooksRepository.name);

  constructor(
    @InjectRepository(Book) booksRepository: Repository<Book>,
    entityManager: EntityManager,
  ) {
    super(booksRepository, entityManager);
  }
}
