import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Role, RolesEnum } from '@app/common';
import { RolesRepository } from '../roles.repository';

@Injectable()
export class RolesSeederService implements OnApplicationBootstrap {
  protected readonly logger = new Logger(RolesSeederService.name);

  constructor(private readonly rolesRepository: RolesRepository) {}

  async onApplicationBootstrap() {
    await this.seedAdminRole();
    await this.seedStoreManagerRole();
    await this.seedUserRole();
  }

  private async seedAdminRole() {
    let existingAdminRole: Role;
    try {
      existingAdminRole = await this.rolesRepository.findOne({
        name: RolesEnum.ADMIN,
      });
    } catch {
      existingAdminRole = null;
    }

    if (!existingAdminRole) {
      const adminRole = new Role({
        name: RolesEnum.ADMIN,
      });

      await this.rolesRepository.create(adminRole);
      this.logger.log(`Admin role created: ${adminRole}`);
    } else {
      this.logger.warn('Admin role already exists');
    }
  }

  private async seedUserRole() {
    let existingUserRole: Role;
    try {
      existingUserRole = await this.rolesRepository.findOne({
        name: RolesEnum.USER,
      });
    } catch {
      existingUserRole = null;
    }

    if (!existingUserRole) {
      const userRole = new Role({
        name: RolesEnum.USER,
      });

      await this.rolesRepository.create(userRole);
      this.logger.log(`User role created: ${userRole}`);
    } else {
      this.logger.warn('User role already exists');
    }
  }

  private async seedStoreManagerRole() {
    let existingStoreManagerRole: Role;
    try {
      existingStoreManagerRole = await this.rolesRepository.findOne({
        name: RolesEnum.STORE_MANAGER,
      });
    } catch {
      existingStoreManagerRole = null;
    }

    if (!existingStoreManagerRole) {
      const storeManagerRole = new Role({
        name: RolesEnum.STORE_MANAGER,
      });

      await this.rolesRepository.create(storeManagerRole);
      this.logger.log(`StoreManager role created: ${storeManagerRole}`);
    } else {
      this.logger.warn('StoreManager role already exists');
    }
  }
}
