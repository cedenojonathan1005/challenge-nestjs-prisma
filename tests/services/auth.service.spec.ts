import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import moment from 'moment-timezone';

import {
  LoginResponse,
  RefreshTokenResponse,
} from '../../src/interfaces/login-response.interface';
import { AuthService } from '../../src/services/auth.service';
import { PrismaService } from '../../src/services/prisma.service';
import { RoleService } from '../../src/services/role.service';
import { UserService } from '../../src/services/user.service';

jest.mock('argon2');
describe('AuthService', () => {
  const rol = {
    id: 1,
    role: 'test',
    userId: 1,
    status: true,
  };
  const user = {
    id: 1,
    name: 'test',
    user: 'test',
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
    status: true,
  };
  const credentials = {
    user: 'test',
    pass: 'test',
  };
  const login = {
    token: 'test',
    refreshToken: 'test',
  };
  const refreshToken = login;
  let service: AuthService;
  let jwtService: JwtService;
  let userService: UserService;
  let roleService: RoleService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        Logger,
        PrismaService,
        RoleService,
        UserService,
        {
          provide: ConfigService,
          useFactory: () => ({
            get: () => ({
              jwt: {
                expiresIn: process.env.JWT_EXPIRES_IN,
                refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
                refreshSecret: process.env.JWT_REFRESH_SECRET,
                secret: process.env.JWT_SECRET,
              },
            }),
          }),
        },
      ],
    }).compile();

    service = app.get<AuthService>(AuthService);
    jwtService = app.get<JwtService>(JwtService);
    userService = app.get<UserService>(UserService);
    roleService = app.get<RoleService>(RoleService);
  });

  beforeEach(() => {
    jest
      .spyOn(argon2, 'verify')
      .mockImplementation(async (): Promise<boolean> => Promise.resolve(true));
    jest
      .spyOn(argon2, 'hash')
      .mockImplementation(async (): Promise<string> => Promise.resolve('test'));
    jwtService.signAsync = jest.fn().mockResolvedValue('test');
    roleService.findManyByUserId = jest.fn().mockResolvedValue([rol]);
    userService.findFirst = jest.fn().mockResolvedValue(user);
  });

  describe('login', () => {
    it('should return login', async () => {
      const result: LoginResponse = await service.login(credentials);

      expect(result).toEqual(login);
    });

    it('should return null', async () => {
      userService.findFirst = jest.fn().mockResolvedValue(null);
      const result: LoginResponse = await service.login(credentials);

      expect(result).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should return refresh token', async () => {
      const result: RefreshTokenResponse = await service.refreshToken('test');

      expect(result).toEqual(refreshToken);
    });

    it('should return null', async () => {
      userService.findFirst = jest.fn().mockResolvedValue(null);
      const result: LoginResponse = await service.refreshToken('test');

      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('should return hash password', async () => {
      const result = await service.hashPassword('test');

      expect(result).toBe('test');
    });
  });
});
