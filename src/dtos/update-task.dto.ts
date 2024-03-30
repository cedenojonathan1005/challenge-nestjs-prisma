import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  readonly status: TaskStatusEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
