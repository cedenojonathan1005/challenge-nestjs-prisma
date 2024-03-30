import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { omit } from 'lodash';

import { CreateRequestDto } from '../dtos/create-request.dto';
import { UpdateRequestDto } from '../dtos/update-request.dto';
import { UserInterface } from '../interfaces/user.interface';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly _authService: AuthService,
    private readonly _logger: Logger,
    private readonly _prismaService: PrismaService,
  ) {}

  async findMany(): Promise<UserInterface[]> {
    return this._prismaService.user.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        name: true,
        user: true,
        pass: false,
        createdAt: true,
        updatedAt: true,
        status: true,
      },
    });
  }

  async findFirst(
    where: Prisma.UserWhereInput,
    include?: Prisma.UserInclude | null,
  ) {
    return this._prismaService.user.findFirst({
      where,
      include,
    });
  }

  async findOne(data: Prisma.UserWhereInput): Promise<UserInterface> {
    const user: User = await this._prismaService.user.findFirst({
      where: { ...data },
    });

    return omit(user, 'pass');
  }

  async create(data: CreateRequestDto): Promise<UserInterface> {
    const pass = await this._authService.hashPassword(data.pass);

    const user: User = await this._prismaService.user.create({
      data: {
        ...data,
        pass,
        rol: { connect: { id: data.rol } },
      },
    });

    return omit(user, 'pass');
  }

  async update(id: number, data: UpdateRequestDto): Promise<UserInterface> {
    let info = data;

    if (data.pass) {
      const pass = await this._authService.hashPassword(data.pass);

      info = { ...data, pass };
    }

    const user: User = await this._prismaService.user.update({
      where: { id },
      data: info,
    });

    return omit(user, 'pass');
  }

  async delete(id: number): Promise<void> {
    await this._prismaService.user
      .delete({ where: { id } })
      .catch((e) => this._logger.log(`${id}: ${e.meta.cause}`));
  }
}
