import { TaskStatusEnum } from '@prisma/client';

interface User {
  id: number;
  user: string;
  name: string;
}

export interface ExpiredTask {
  id: number;
  name: string;
  expiredAt: Date;
  status: TaskStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  user: User;
}
