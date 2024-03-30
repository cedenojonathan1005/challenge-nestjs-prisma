import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import config from './config';
import { TaskController } from './controllers/task.controller';
import { UserController } from './controllers/user.controller';
import { LoggerMiddleware } from './logger.middleware';
import { AuthService } from './services/auth.service';
import { PrismaService } from './services/prisma.service';
import { RoleService } from './services/role.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    JwtModule.register({}),
  ],
  controllers: [UserController, TaskController],
  providers: [
    AuthService,
    ConfigService,
    JwtService,
    JwtStrategy,
    Logger,
    PrismaService,
    RefreshTokenStrategy,
    RoleService,
    UserService,
    TaskService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
