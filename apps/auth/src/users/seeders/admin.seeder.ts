import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role, RolesEnum, User } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../users.repository';
import { RolesRepository } from '../roles.repository';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(AdminSeederService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail =
      this.configService.get('ADMIN_EMAIL') || 'admin@example.com';
    const adminPassword =
      this.configService.get('ADMIN_PASSWORD') || 'admin123';

    let existingAdmin;

    try {
      existingAdmin = await this.usersRepository.findOne({
        email: adminEmail,
      });
    } catch {
      existingAdmin = null;
    }

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminRole = await this.rolesRepository.findOne({
        name: RolesEnum.ADMIN,
      });

      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        roles: [adminRole],
      });

      await this.usersRepository.create(admin);
      this.logger.log(`Admin user created: ${adminEmail}`);
    } else {
      this.logger.warn('Admin user already exists');
    }
  }
}
