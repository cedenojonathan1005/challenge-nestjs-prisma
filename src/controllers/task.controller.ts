import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Task } from '@prisma/client';

import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ExpiredTask } from '../interfaces/expired-task.interface';
import { TaskService } from '../services/task.service';

@ApiTags('')
@Controller('task')
export class TaskController {
  constructor(private readonly _taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @ApiBadRequestResponse()
  async createTask(@Body() body: CreateTaskDto): Promise<Task> {
    return await this._taskService.createTask(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBadRequestResponse()
  async getTasks(@Query('userId') userId: string): Promise<Task[]> {
    return await this._taskService.getTasks({ userId: +userId });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async updateTask(
    @Param('id') id: string,
    @Req() req,
    @Body() body: UpdateTaskDto,
  ): Promise<Task> {
    return this._taskService.updateTask(req.user.id, body, +id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async delete(@Param('id') id: string): Promise<void> {
    await this._taskService.deleteTask(+id);
  }

  @Get('expired-tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async findExpiredTask(): Promise<ExpiredTask[]> {
    return this._taskService.findExpiredTasks();
  }
}
