import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, Task, TaskStatusEnum } from '@prisma/client';

import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { ExpiredTask } from '../interfaces/expired-task.interface';
import { PrismaService } from './prisma.service';
import { AppGateway } from './web-socket.gateway';

@Injectable()
export class TaskService {
  constructor(
    private readonly _logger: Logger,
    private readonly _prismaService: PrismaService,
    private readonly _websocketService: AppGateway,
  ) {}

  async getTasks(data: Prisma.TaskWhereInput): Promise<Task[]> {
    return this._prismaService.task.findMany({
      where: {
        ...data,
      },
    });
  }

  async findOne(data: Prisma.TaskWhereInput): Promise<Task> {
    return this._prismaService.task.findFirst({
      where: {
        ...data,
      },
    });
  }

  async createTask(data: CreateTaskDto): Promise<Task> {
    const task = await this.findOne({ name: data.name });

    if (task) {
      throw new BadRequestException('Task already exists');
    }

    return this._prismaService.task.create({
      data,
    });
  }

  async updateTask(
    userId: number,
    data: UpdateTaskDto,
    id: number,
  ): Promise<Task> {
    const task = await this.findOne({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to edit this task.',
      );
    }
    const taskUpdated = await this._prismaService.task.update({
      where: { id },
      data,
    });

    this._websocketService.handleUpdateTodo(taskUpdated);

    return taskUpdated;
  }

  async deleteTask(id: number): Promise<void> {
    await this._prismaService.task
      .delete({ where: { id } })
      .catch((e) => this._logger.log(`${id}: ${e.meta.cause}`));
  }

  async findExpiredTasks(): Promise<ExpiredTask[]> {
    const currentDate = new Date();

    return this._prismaService.task.findMany({
      where: {
        expiredAt: {
          lt: currentDate,
        },
        status: {
          not: TaskStatusEnum.COMPLETE,
        },
      },
      select: {
        id: true,
        name: true,
        expiredAt: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        user: { select: { id: true, user: true, name: true } },
      },
      orderBy: {
        expiredAt: 'asc',
      },
    });
  }
}
