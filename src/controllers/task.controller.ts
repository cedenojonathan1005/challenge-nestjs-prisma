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

import { Roles } from '../decorators/roles.decorator';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { RolesEnum } from '../enums/roles.emun';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ExpiredTask } from '../interfaces/expired-task.interface';
import { TaskService } from '../services/task.service';
import { AppGateway } from '../services/web-socket.gateway';

@ApiTags('')
@Controller('task')
export class TaskController {
  constructor(
    private readonly _taskService: TaskService,
    private readonly _websocketService: AppGateway,
  ) {}

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
    const taskUpdated = await this._taskService.updateTask(
      req.user.id,
      body,
      +id,
    );

    this._websocketService.server.emit('todoUpdated', taskUpdated);

    return taskUpdated;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async delete(@Req() req, @Param('id') id: string): Promise<void> {
    await this._taskService.deleteTask(+id, req.user.id);
  }

  @Get('expired-tasks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @ApiSecurity('bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async findExpiredTask(): Promise<ExpiredTask[]> {
    return await this._taskService.findExpiredTasks();
  }
}
