import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants';
import { Reflector } from '@nestjs/core';
import { User } from '../models';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorizationToken = request.headers.authorization;

    if (!authorizationToken || !authorizationToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('messages.INVALID_AUTHORIZATION_HEADER');
    }

    const jwt = authorizationToken.substring(7);
    if (!jwt) return false;

    const requiredRoles = this.reflector.get('roles', context.getHandler());

    return this.authClient
      .send<User>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res: User) => {
          if (requiredRoles) {
            const hasRole = requiredRoles.some((role: string) =>
              res.roles?.map((role) => role.name).includes(role),
            );
            if (!hasRole) {
              throw new UnauthorizedException('messages.PERMISSION_DENIED');
            }
          }
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
