import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, Roles, SuccessMessage, User, UserDto } from '@app/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { omit } from 'lodash';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @SuccessMessage('messages.LOGIN_SUCCEEDED')
  async login(@CurrentUser() user: User) {
    const token = await this.authService.login(user);
    return { token, user: omit(user, ['password']) };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: UserDto) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
