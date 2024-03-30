import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

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
