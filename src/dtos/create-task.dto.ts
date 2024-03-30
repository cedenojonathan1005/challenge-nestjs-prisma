import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsEnum(TaskStatusEnum)
  @IsNotEmpty()
  readonly status: TaskStatusEnum;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  readonly expiredAt: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
