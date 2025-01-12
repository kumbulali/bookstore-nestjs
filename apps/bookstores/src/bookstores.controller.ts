import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookstoresService } from './bookstores.service';
import {
  JwtAuthGuard,
  Roles,
  RolesEnum,
  StoreManagerGuard,
  SuccessMessage,
} from '@app/common';
import { CreateBookstoreDto } from './dtos/create-bookstore.dto';
import { CreateBookDto } from './dtos/create-book.dto';
import { BookstoreIdDto } from './dtos/bookstore-id.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('bookstores')
export class BookstoresController {
  constructor(private readonly bookstoresService: BookstoresService) {}

  @Get(':bookstoreId/books')
  @SuccessMessage('messages.BOOKS_RETRIEVED')
  @UseGuards(JwtAuthGuard)
  async getBooksOfBookstores(@Param() params: BookstoreIdDto) {
    return await this.bookstoresService.getBooksOfBookstores(
      params.bookstoreId,
    );
  }

  @Post()
  @SuccessMessage('messages.BOOKSTORE_CREATED')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async createBookstore(@Body() createBookstoreDto: CreateBookstoreDto) {
    return await this.bookstoresService.createBookstore(createBookstoreDto);
  }

  @Delete(':bookstoreId')
  @SuccessMessage('messages.BOOKSTORE_DELETED')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteBookstore(@Param() params: BookstoreIdDto) {
    return await this.bookstoresService.deleteBookstoreById(params.bookstoreId);
  }

  @MessagePattern('find_bookstore')
  async findBookstore(@Payload() payload: BookstoreIdDto) {
    try {
      const foundBookstore = await this.bookstoresService.getBookstoreById(
        payload.bookstoreId,
      );
      return foundBookstore;
    } catch (err) {
      throw new RpcException({
        statusCode: 404,
        message: 'messages.BOOKSTORE_NOT_FOUND',
        error: 'Not Found',
      });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBookstores() {
    return await this.bookstoresService.getAllBookstores();
  }

  @Post(':bookstoreId/book')
  @SuccessMessage('messages.BOOK_ADDED')
  @UseGuards(JwtAuthGuard, StoreManagerGuard)
  @Roles(RolesEnum.ADMIN, RolesEnum.STORE_MANAGER)
  async addBookToBookstore(
    @Param() params: BookstoreIdDto,
    @Body() createBookDto: CreateBookDto,
  ) {
    return await this.bookstoresService.addBookToBookstore(
      params.bookstoreId,
      createBookDto,
    );
  }
}
