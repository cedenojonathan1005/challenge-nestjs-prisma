import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { metadataKey } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: number[] = this._reflector.get<number[]>(
      metadataKey,
      context.getHandler(),
    );

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    return roles.some((rol: number) => request.user.roles.includes(rol));
  }
}
