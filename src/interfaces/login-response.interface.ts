import { ApiProperty } from '@nestjs/swagger';

export type RefreshTokenResponseInterface = RefreshTokenResponse;

export type LoginResponseInterface = LoginResponse;

export class LoginResponse {
  @ApiProperty()
  readonly token: string;

  @ApiProperty()
  readonly refreshToken: string;
}

export class RefreshTokenResponse extends LoginResponse {}
