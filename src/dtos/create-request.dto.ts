import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { RolesEnum } from '../enums/roles.emun';

export class CreateRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly pass: string;

  @ApiProperty()
  @IsEnum(RolesEnum)
  @IsNotEmpty()
  readonly rol: RolesEnum;
}
