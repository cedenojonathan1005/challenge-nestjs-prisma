import { Injectable } from '@nestjs/common';
import { Rol } from '@prisma/client';

import { PrismaService } from './prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly _prismaService: PrismaService) {}

  async findManyByUserId(userId: number): Promise<Rol[]> {
    return this._prismaService.rol.findMany({
      where: {
        status: true,
        user: {
          some: {
            id: userId,
          },
        },
      },
    });
  }
}
