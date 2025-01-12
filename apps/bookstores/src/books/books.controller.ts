import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import {
  IdDto,
  JwtAuthGuard,
  Roles,
  RolesEnum,
  SuccessMessage,
} from '@app/common';

@Controller('books')
export class BooksController {
  constructor(private readonly bookstoresService: BooksService) {}

  @Delete(':id')
  @SuccessMessage('messages.BOOK_DELETED')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteBookById(@Param() params: IdDto) {
    return await this.bookstoresService.deleteBookById(params.id);
  }
}
