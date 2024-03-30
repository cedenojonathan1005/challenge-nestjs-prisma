import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { LoginRequestDto } from '../dtos/login-request.dto';
import { AuthInterface } from '../interfaces/auth.interface';
import { EnvInterface } from '../interfaces/env.interface';
import {
  LoginResponseInterface,
  RefreshTokenResponseInterface,
} from '../interfaces/login-response.interface';
import { RoleService } from './role.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _roleService: RoleService,
    private readonly _userService: UserService,
  ) {}

  async login({
    user,
    pass,
  }: LoginRequestDto): Promise<LoginResponseInterface | null> {
    const userInfo = await this._userService.findFirst(
      {
        user,
      },
      {
        rol: true,
      },
    );

    if (userInfo && (await this._verifyPassword(userInfo.pass, pass))) {
      return this._generate({
        id: userInfo.id,
        user: userInfo.user,
        roles: userInfo.rol.map(({ id }) => id),
      });
    }

    return null;
  }

  async refreshToken(
    user: string,
  ): Promise<RefreshTokenResponseInterface | null> {
    const userInfo = await this._userService.findFirst(
      {
        user,
      },
      {
        rol: true,
      },
    );

    if (userInfo) {
      return this._generate({
        id: userInfo.id,
        user: userInfo.user,
        roles: userInfo.rol.map(({ id }) => id),
      });
    }

    return null;
  }

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async _generate(
    payload: AuthInterface,
  ): Promise<LoginResponseInterface> {
    const {
      jwt: { expiresIn, refreshExpiresIn, refreshSecret, secret },
    }: EnvInterface = this._configService.get<EnvInterface>('config');
    const [token, refreshToken] = await Promise.all([
      this._jwtService.signAsync(payload, {
        secret,
        expiresIn,
      }),
      this._jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      }),
    ]);

    return { token, refreshToken };
  }

  private async _verifyPassword(
    hash: string,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(hash, password);
  }
}
