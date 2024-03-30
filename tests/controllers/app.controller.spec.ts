import { HttpException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import moment from 'moment-timezone';

import { UserController } from '../../src/controllers/user.controller';
import { UpdateRequestDto } from '../../src/dtos/update-request.dto';
import {
  LoginResponseInterface,
  RefreshTokenResponse,
} from '../../src/interfaces/login-response.interface';
import { UserInterface } from '../../src/interfaces/user.interface';
import { AuthService } from '../../src/services/auth.service';
import { PrismaService } from '../../src/services/prisma.service';
import { RoleService } from '../../src/services/role.service';
import { UserService } from '../../src/services/user.service';

describe('AppController', () => {
  const user = {
    id: 1,
    name: 'test',
    user: 'test',
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
    status: true,
  };
  const login = {
    token: 'test',
    refreshToken: 'test',
  };
  const refreshToken = login;
  const credentials = {
    user: 'test',
    pass: 'test',
  };
  const req = {
    user: { user: 'test' },
  };
  const userDto = {
    ...user,
    pass: 'test',
  };
  let appController: UserController;
  let authService: AuthService;
  let userService: UserService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        AuthService,
        ConfigService,
        JwtService,
        Logger,
        PrismaService,
        RoleService,
        UserService,
      ],
    }).compile();

    appController = app.get<UserController>(UserController);
    authService = app.get<AuthService>(AuthService);
    userService = app.get<UserService>(UserService);
  });

  beforeEach(() => {
    authService.login = jest.fn().mockResolvedValue(login);
    authService.refreshToken = jest.fn().mockResolvedValue(refreshToken);
    userService.findMany = jest.fn().mockResolvedValue([user]);
    userService.findOne = jest.fn().mockResolvedValue(user);
    userService.findFirst = jest.fn().mockResolvedValue(user);
    userService.create = jest.fn().mockResolvedValue(user);
    userService.update = jest.fn().mockResolvedValue(user);
    userService.delete = jest.fn().mockResolvedValue(null);
  });

  describe('getUsers', () => {
    it('should return users', async () => {
      const result: UserInterface[] = await appController.getUsers();

      expect(result).toEqual([user]);
    });
  });

  describe('getOne', () => {
    it('should return user', async () => {
      const result: UserInterface = await appController.getOne('1');

      expect(result).toEqual(user);
    });
  });

  describe('create', () => {
    it('should return user', async () => {
      userService.findFirst = jest.fn().mockResolvedValue(null);
      const result: UserInterface = await appController.create({
        ...user,
        pass: 'test',
      });

      expect(result).toEqual(user);
    });

    it('should return error', async () => {
      await expect(appController.create(userDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('login', () => {
    it('should return login', async () => {
      const result: LoginResponseInterface = await appController.login(
        credentials,
      );

      expect(result).toEqual(login);
    });

    it('should return error', async () => {
      authService.login = jest.fn().mockResolvedValue(null);
      await expect(appController.login(credentials)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return refresh token', async () => {
      const result: RefreshTokenResponse = await appController.refreshToken(
        req,
      );

      expect(result).toEqual(refreshToken);
    });

    it('should return error', async () => {
      authService.refreshToken = jest.fn().mockResolvedValue(null);
      await expect(appController.refreshToken(req)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('update', () => {
    it('should return user', async () => {
      const result: UserInterface = await appController.update(
        req,
        <UpdateRequestDto>undefined,
      );

      expect(result).toEqual(user);
    });

    it('should return user check', async () => {
      userService.findFirst = jest.fn().mockResolvedValue(null);
      const result: UserInterface = await appController.update(req, userDto);

      expect(result).toEqual(user);
    });

    it('should return error', async () => {
      await expect(appController.update(req, userDto)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('delete', () => {
    it('should return ok', async () => {
      const result = await appController.delete('1');

      expect(result).toBeUndefined();
    });
  });
});
