import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class UpdateRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.name && !o.pass)
  readonly user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.user && !o.pass)
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => !o.name && !o.user)
  readonly pass: string;
}
