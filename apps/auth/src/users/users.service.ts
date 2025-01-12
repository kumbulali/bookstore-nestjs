import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserIdDto } from './dtos/user-id.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { BOOKSTORE_SERVICE, Role, RolesEnum, User } from '@app/common';
import { RolesRepository } from './roles.repository';
import { omit } from 'lodash';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AssignStoreManagerDto } from './dtos/assign-store-manager.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    @Inject(BOOKSTORE_SERVICE) private readonly bookstoresService: ClientProxy,
  ) {}

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email }, { roles: true });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('messages.CREDENTIALS_NOT_VALID');
    }
    return user;
  }

  async getUser(userIdDto: UserIdDto) {
    const foundUser = await this.usersRepository.findOne(userIdDto, {
      roles: true,
    });
    return omit(foundUser, ['password']);
  }

  async createUser(createUserDto: CreateUserDto) {
    let roles: Role[];
    if (createUserDto.roles?.length) {
      roles = await this.rolesRepository.findByNames(createUserDto.roles);
    } else {
      roles = [await this.rolesRepository.findOne({ name: RolesEnum.USER })];
    }

    const newUser = new User({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
      roles,
    });

    const createdUser = await this.usersRepository.create(newUser);
    return omit(createdUser, ['password']);
  }

  async getAllUsers() {
    const users = await this.usersRepository.find({
      select: ['email', 'roles', 'id'],
      relations: { roles: true },
    });

    return users;
  }

  async deleteUser(userId: number) {
    return await this.usersRepository.findOneAndDelete({ id: userId });
  }

  async assignStoreManager(
    assignStoreManagerDto: AssignStoreManagerDto,
  ): Promise<User> {
    const bookstore = await firstValueFrom(
      this.bookstoresService.send('find_bookstore', {
        bookstoreId: assignStoreManagerDto.bookstoreId,
      }),
    );

    const user = await this.usersRepository.findOne(
      {
        email: assignStoreManagerDto.email,
      },
      { roles: true },
    );
    if (!user) {
      throw new NotFoundException('messages.USER_NOT_FOUND');
    }

    let storeManagerRole = await this.rolesRepository.findOne({
      name: RolesEnum.STORE_MANAGER,
    });
    if (!user.roles?.some((role) => role.name === RolesEnum.STORE_MANAGER)) {
      user.roles.push(storeManagerRole);
    }

    user.bookstore = bookstore;

    return await this.usersRepository.save(user);
  }
}
