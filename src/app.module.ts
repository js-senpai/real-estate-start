import { Logger, Module } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@common/services/prisma.service';
import { UserModule } from './api/users/user/user.module';
import { AuthModule } from './api/users/auth/auth.module';

@Module({
  imports: [
    // Config module
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    Logger,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
