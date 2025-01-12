import { Injectable } from '@nestjs/common';
import { BooksRepository } from './books.repository';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async deleteBookById(bookId: number) {
    return await this.booksRepository.findOneAndDelete({ id: bookId });
  }
}
