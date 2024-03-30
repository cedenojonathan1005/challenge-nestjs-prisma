import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TaskStatusEnum } from '@prisma/client';

import { TaskController } from '../../src/controllers/task.controller';
import { ExpiredTask } from '../../src/interfaces/expired-task.interface';
import { PrismaService } from '../../src/services/prisma.service';
import { TaskService } from '../../src/services/task.service';
import { AppGateway } from '../../src/services/web-socket.gateway';

describe('TaskController', () => {
  const taskRequest = {
    name: 'Task Test 7',
    status: TaskStatusEnum.TODO,
    expiredAt: new Date(),
    userId: 1,
    description: 'Task description test for BD 6',
  };
  const taskResponse = {
    id: 7,
    name: 'Task Test 7',
    expiredAt: '2023-01-15T00:00:00.000Z',
    status: TaskStatusEnum.COMPLETE,
    createdAt: '2024-03-29T21:42:25.454Z',
    updatedAt: '2024-03-29T21:42:25.454Z',
    description: 'Task description test for BD 6',
  };
  const taskUpdateRequest = {
    name: 'Task Test 7',
    status: TaskStatusEnum.COMPLETE,
    description: 'Task description test for BD 6',
  };
  const req = {
    user: { id: 1 },
  };

  const expiredTask: ExpiredTask = {
    id: 6,
    name: 'Task Test 6',
    expiredAt: new Date('2024-03-30T00:00:00.000Z'),
    status: 'TODO',
    createdAt: new Date('2024-03-30T00:00:00.000Z'),
    updatedAt: new Date('2024-03-30T00:00:00.000Z'),
    description: 'Task description test for BD 6',
    user: {
      id: 1,
      user: 'admin',
      name: 'Pedro Manual',
    },
  };

  let taskController: TaskController;
  let taskService: TaskService;
  let appGateway: AppGateway;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        Logger,
        PrismaService,
        {
          provide: AppGateway,
          useValue: {
            server: {
              emit: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    taskController = app.get<TaskController>(TaskController);
    taskService = app.get<TaskService>(TaskService);
    appGateway = app.get<AppGateway>(AppGateway);
  });

  beforeEach(() => {
    taskService.createTask = jest.fn().mockResolvedValue(taskResponse);
    taskService.getTasks = jest.fn().mockResolvedValue([taskResponse]);
    taskService.updateTask = jest.fn().mockResolvedValue(taskResponse);
    taskService.deleteTask = jest.fn();
    taskService.findExpiredTasks = jest.fn().mockResolvedValue([expiredTask]);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('createTask', () => {
    it('should return a task', async () => {
      const result = await taskController.createTask(taskRequest);

      expect(taskService.createTask).toHaveBeenCalledTimes(1);
      expect(taskService.createTask).toHaveBeenCalledWith(taskRequest);
      expect(result).toEqual(taskResponse);
    });
  });

  describe('getTasks', () => {
    it('should return a list of tasks', async () => {
      const result = await taskController.getTasks('1');

      expect(taskService.getTasks).toHaveBeenCalledTimes(1);
      expect(taskService.getTasks).toHaveBeenCalledWith({ userId: 1 });
      expect(result).toEqual([taskResponse]);
    });
  });

  describe('updateTask', () => {
    it('should return a task', async () => {
      const result = await taskController.updateTask(
        '7',
        req,
        taskUpdateRequest,
      );

      expect(taskService.updateTask).toHaveBeenCalledTimes(1);
      expect(taskService.updateTask).toHaveBeenCalledWith(
        1,
        taskUpdateRequest,
        7,
      );
      expect(appGateway.server.emit).toHaveBeenCalledTimes(1);
      expect(appGateway.server.emit).toHaveBeenCalledWith(
        'todoUpdated',
        taskResponse,
      );
      expect(result).toEqual(taskResponse);
    });
  });

  describe('delete', () => {
    it('should delete a task', async () => {
      await taskController.delete(req, '7');

      expect(taskService.deleteTask).toHaveBeenCalledTimes(1);
      expect(taskService.deleteTask).toHaveBeenCalledWith(7, 1);
    });
  });

  describe('getExpiredTasks', () => {
    it('should return a list of expired tasks', async () => {
      const result = await taskController.findExpiredTask();

      expect(taskService.findExpiredTasks).toHaveBeenCalledTimes(1);
      expect(result).toEqual([expiredTask]);
    });
  });
});
