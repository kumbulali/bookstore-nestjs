import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles, RolesEnum, SuccessMessage } from '@app/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserIdDto } from './dtos/user-id.dto';
import { AssignStoreManagerDto } from './dtos/assign-store-manager.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SuccessMessage('messages.USER_CREATED')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    return newUser;
  }

  @Get()
  @SuccessMessage('messages.USERS_RETRIEVED')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Delete(':id')
  @SuccessMessage('messages.USER_DELETED')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async deleteUser(@Param() params: UserIdDto) {
    await this.usersService.deleteUser(params.id);
    return;
  }

  @Post('assign-manager')
  @SuccessMessage('messages.USER_ASSIGNED')
  @UseGuards(JwtAuthGuard)
  @Roles(RolesEnum.ADMIN)
  async assignStoreManager(
    @Body() assignStoreManagerDto: AssignStoreManagerDto,
  ) {
    await this.usersService.assignStoreManager(assignStoreManagerDto);
    return;
  }
}
