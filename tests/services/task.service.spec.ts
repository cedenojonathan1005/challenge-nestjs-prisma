import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatusEnum } from '@prisma/client';

import { PrismaService } from '../../src/services/prisma.service';
import { TaskService } from '../../src/services/task.service';

describe('TaskService', () => {
  const taskResponse = {
    id: 7,
    name: 'Task Test 7',
    expiredAt: '2023-01-15T00:00:00.000Z',
    status: TaskStatusEnum.COMPLETE,
    createdAt: '2024-03-29T21:42:25.454Z',
    updatedAt: '2024-03-29T21:42:25.454Z',
    description: 'Task description test for BD 6',
    userId: 1,
  };

  const taskRequest = {
    name: 'Task Test 7',
    status: TaskStatusEnum.COMPLETE,
    expiredAt: new Date('2023-01-15T00:00:00.000Z'),
    userId: 1,
    description: 'Task description test for BD 6',
  };

  const taskUpdateRequest = {
    name: 'Task Test 7',
    status: TaskStatusEnum.COMPLETE,
    description: 'Task description test for BD 6',
  };

  const expiredTaskResponse = [
    {
      id: 6,
      name: 'Task Test 6',
      expiredAt: '2024-01-15T00:00:00.000Z',
      status: 'TODO',
      createdAt: '2024-03-29T21:41:51.467Z',
      updatedAt: '2024-03-29T21:41:51.467Z',
      description: 'Task description test for BD 6',
      user: {
        id: 1,
        user: 'admin',
        name: 'Pedro Manual',
      },
    },
  ];
  let service: TaskService;

  let prismaService: PrismaService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [Logger, PrismaService, TaskService],
    }).compile();

    service = app.get<TaskService>(TaskService);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  beforeEach(() => {
    prismaService.task.findMany = jest.fn().mockResolvedValue([taskResponse]);
    prismaService.task.findFirst = jest.fn().mockResolvedValue(taskResponse);
    prismaService.task.create = jest.fn().mockResolvedValue(taskResponse);
    prismaService.task.update = jest.fn().mockResolvedValue(taskResponse);
    prismaService.task.delete = jest.fn().mockResolvedValue(null);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTasks', () => {
    it('should return an array of tasks', async () => {
      const tasks = await service.getTasks({});

      expect(tasks).toEqual([taskResponse]);
    });
  });

  describe('findOne', () => {
    it('should return a task', async () => {
      const task = await service.findOne({ id: 7 });

      expect(task).toEqual(taskResponse);
    });
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      jest.spyOn(global, 'Date').mockImplementation(() => {
        return new Date('2023-01-15T00:00:00.000Z');
      });
      prismaService.task.findFirst = jest.fn().mockResolvedValue(null);
      const task = await service.createTask(taskRequest);

      expect(prismaService.task.create).toHaveBeenCalledTimes(1);
      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: taskRequest,
      });
      expect(task).toEqual(taskResponse);
    });

    it('should throw an error if the task already exists', async () => {
      try {
        await service.createTask(taskRequest);
      } catch (err) {
        expect(err.message).toBe('Task already exists');
      }
    });
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const task = await service.updateTask(1, taskUpdateRequest, 7);

      expect(prismaService.task.update).toHaveBeenCalledTimes(1);
      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: taskUpdateRequest,
      });
      expect(task).toEqual(taskResponse);
    });

    it('should throw an error if the task does not exist', async () => {
      prismaService.task.findFirst = jest.fn().mockResolvedValue(null);
      try {
        await service.updateTask(1, taskUpdateRequest, 7);
      } catch (err) {
        expect(err.message).toBe('Task not found');
      }
    });

    it('should throw an error if the user does not have permission', async () => {
      prismaService.task.findFirst = jest.fn().mockResolvedValue(taskResponse);
      try {
        await service.updateTask(2, taskUpdateRequest, 7);
      } catch (err) {
        expect(err.message).toBe(
          'You do not have permission to edit this task.',
        );
      }
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      await service.deleteTask(7, 1);

      expect(prismaService.task.delete).toHaveBeenCalledTimes(1);
      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: 7, userId: 1 },
      });
    });

    it('should catch an error', async () => {
      prismaService.task.delete = jest
        .fn()
        .mockRejectedValue({ meta: { cause: 'error' } });
      const loggerSpy = jest.spyOn(Logger.prototype, 'log');

      try {
        await service.deleteTask(7, 1);
      } catch (err) {
        expect(loggerSpy).toHaveBeenCalledTimes(1);
        expect(loggerSpy).toHaveBeenCalledWith('7: error');
        expect(err.message).toBe('Task not found');
      }
    });
  });

  describe('findExpiredTasks', () => {
    it('should return an array of expired tasks', async () => {
      const currentDate = new Date('2024-03-29T21:42:25.454Z');

      jest.spyOn(global, 'Date').mockImplementation(() => {
        return currentDate;
      });
      prismaService.task.findMany = jest
        .fn()
        .mockResolvedValue(expiredTaskResponse);

      await service.findExpiredTasks();

      expect(prismaService.task.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
