import { ApiProperty } from '@nestjs/swagger';

export type UserInterface = UserInfo;

export class UserInfo {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly user: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty()
  readonly status: boolean;
}
