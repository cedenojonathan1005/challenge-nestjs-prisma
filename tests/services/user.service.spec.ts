import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import moment from 'moment-timezone';

import { UserInterface } from '../../src/interfaces/user.interface';
import { AuthService } from '../../src/services/auth.service';
import { PrismaService } from '../../src/services/prisma.service';
import { RoleService } from '../../src/services/role.service';
import { UserService } from '../../src/services/user.service';

describe('UserService', () => {
  const user = {
    id: 1,
    name: 'test',
    user: 'test',
    createdAt: moment().toDate(),
    updatedAt: moment().toDate(),
    status: true,
  };
  const userDto = {
    ...user,
    pass: 'test',
  };
  let service: UserService;
  let authService: AuthService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
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

    service = app.get<UserService>(UserService);
    prismaService = app.get<PrismaService>(PrismaService);
    authService = app.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    authService.hashPassword = jest.fn().mockResolvedValue('test');
    prismaService.user.findMany = jest.fn().mockResolvedValue([user]);
    prismaService.user.findFirst = jest.fn().mockResolvedValue(user);
    prismaService.user.create = jest.fn().mockResolvedValue(user);
    prismaService.user.update = jest.fn().mockResolvedValue(user);
    prismaService.user.delete = jest.fn().mockResolvedValue(null);
  });

  describe('findMany', () => {
    it('should return users', async () => {
      const result: UserInterface[] = await service.findMany();

      expect(result).toEqual([user]);
    });
  });

  describe('findFirst', () => {
    it('should return user', async () => {
      const result: User = await service.findFirst({});

      expect(result).toEqual(user);
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      const result: UserInterface = await service.findOne({});

      expect(result).toEqual(user);
    });
  });

  describe('create', () => {
    it('should return user', async () => {
      const result: UserInterface = await service.create(userDto);

      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should return user', async () => {
      const result: UserInterface = await service.update(1, userDto);

      expect(result).toEqual(user);
    });

    it('should return user without pass param', async () => {
      const result: UserInterface = await service.update(1, {
        ...user,
        pass: undefined,
      });

      expect(result).toEqual(user);
    });
  });

  describe('delete', () => {
    it('should return ok', async () => {
      const result = await service.delete(1);

      expect(result).toBeUndefined();
    });

    it('should return log error', async () => {
      prismaService.user.delete = jest
        .fn()
        .mockRejectedValue({ meta: { cause: 'test' } });

      const result = await service.delete(1);

      expect(result).toBeUndefined();
    });
  });
});
