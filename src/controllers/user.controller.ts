import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

import { Roles } from '../decorators/roles.decorator';
import { CreateRequestDto } from '../dtos/create-request.dto';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { UpdateRequestDto } from '../dtos/update-request.dto';
import { RolesEnum } from '../enums/roles.emun';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import {
  LoginResponse,
  LoginResponseInterface,
  RefreshTokenResponse,
  RefreshTokenResponseInterface,
} from '../interfaces/login-response.interface';
import { UserInfo, UserInterface } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@ApiTags('')
@Controller()
export class UserController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
  ) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse({
    type: UserInfo,
    isArray: true,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async getUsers(): Promise<UserInterface[]> {
    return this._userService.findMany();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse({
    type: UserInfo,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async getOne(@Param('id') id: string): Promise<UserInterface> {
    return this._userService.findOne({ id: +id });
  }

  @Post()
  @ApiCreatedResponse({
    type: UserInfo,
  })
  @ApiBadRequestResponse()
  async create(@Body() body: CreateRequestDto): Promise<UserInterface> {
    const user: User = await this._userService.findFirst({ user: body.user });

    if (user) throw new BadRequestException('User already exists');

    return this._userService.create(body);
  }

  @Post('login')
  @ApiCreatedResponse({
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse()
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseInterface> {
    const login: LoginResponseInterface = await this._authService.login(body);

    if (!login) throw new UnauthorizedException();

    return login;
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @ApiSecurity('bearer')
  @ApiCreatedResponse({
    type: RefreshTokenResponse,
  })
  @ApiUnauthorizedResponse()
  async refreshToken(@Req() req): Promise<RefreshTokenResponseInterface> {
    const refresh: RefreshTokenResponseInterface =
      await this._authService.refreshToken(req.user.user);

    if (!refresh) throw new UnauthorizedException();

    return refresh;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse({
    type: UserInfo,
  })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  async update(@Req() req, @Body() body: UpdateRequestDto): Promise<any> {
    if (body?.user) {
      const user: User = await this._userService.findFirst({
        NOT: { id: req.user.id },
        user: body.user,
      });

      if (user) throw new BadRequestException('User already exists');
    }

    return this._userService.update(req.user.id, body);
  }

  @Delete(':id')
  @Roles(RolesEnum.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async delete(@Param('id') id: string): Promise<void> {
    await this._userService.delete(+id);
  }
}
