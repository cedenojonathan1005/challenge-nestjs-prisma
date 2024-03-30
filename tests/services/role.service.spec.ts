import { Test, TestingModule } from '@nestjs/testing';
import { Rol } from '@prisma/client';

import { PrismaService } from '../../src/services/prisma.service';
import { RoleService } from '../../src/services/role.service';

describe('RoleService', () => {
  const rol = {
    id: 1,
    role: 'test',
    userId: 1,
    status: true,
  };
  let service: RoleService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, RoleService],
    }).compile();

    service = app.get<RoleService>(RoleService);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    prismaService.rol.findMany = jest.fn().mockResolvedValue([rol]);
  });

  describe('findManyByUserId', () => {
    it('should return roles', async () => {
      const result: Rol[] = await service.findManyByUserId(1);

      expect(result).toEqual([rol]);
    });
  });
});
