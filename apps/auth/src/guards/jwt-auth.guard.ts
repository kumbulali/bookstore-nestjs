import { Role } from '@app/common';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const jwt =
      request?.Authentication || request?.headers?.authorization.substring(7);
    if (!jwt) {
      throw new UnauthorizedException('messages.INVALID_AUTHORIZATION_HEADER');
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) {
      throw new UnauthorizedException('messages.UNAUTHORIZED');
    }
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (requiredRoles) {
      const hasRole = requiredRoles.some((role) =>
        user?.roles?.map((role: Role) => role.name).includes(role),
      );
      if (!hasRole) {
        throw new UnauthorizedException('messages.PERMISSION_DENIED');
      }
    }

    return user;
  }
}
