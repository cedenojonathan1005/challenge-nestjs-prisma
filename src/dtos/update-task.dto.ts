import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty()
  @IsEnum(TaskStatusEnum)
  @IsOptional()
  readonly status?: TaskStatusEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description?: string;
}
