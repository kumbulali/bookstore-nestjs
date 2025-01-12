import { Injectable } from '@nestjs/common';
import { BookstoresRepository } from './bookstores.repository';
import { CreateBookstoreDto } from './dtos/create-bookstore.dto';
import { Bookstore } from '../../../libs/common/src/models/bookstores.entity';
import { CreateBookDto } from './dtos/create-book.dto';
import { Book } from '@app/common';

@Injectable()
export class BookstoresService {
  constructor(private readonly bookstoresRepository: BookstoresRepository) {}

  async getBooksOfBookstores(storeId: number) {
    const bookStore = await this.bookstoresRepository.findOne(
      { id: storeId },
      { books: true },
    );
    return bookStore.books || [];
  }

  async createBookstore(createBookstoreDto: CreateBookstoreDto) {
    const bookstore = new Bookstore(createBookstoreDto);
    return await this.bookstoresRepository.create(bookstore);
  }

  async deleteBookstoreById(bookstoreId: number) {
    await this.bookstoresRepository.findOneAndDelete({ id: bookstoreId });
  }

  async getBookstoreById(bookstoreId: number) {
    return await this.bookstoresRepository.findOne({ id: bookstoreId });
  }

  async getAllBookstores() {
    return await this.bookstoresRepository.find({
      select: { name: true, id: true },
    });
  }

  async addBookToBookstore(bookstoreId: number, createBookDto: CreateBookDto) {
    const foundBookstore = await this.bookstoresRepository.findOne({
      id: bookstoreId,
    });
    const newBook = new Book(createBookDto);

    if (!foundBookstore.books) foundBookstore.books = [newBook];
    else foundBookstore.books?.push(newBook);

    return await this.bookstoresRepository.save(foundBookstore);
  }
}
