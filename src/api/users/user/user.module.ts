import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../../common/services/prisma.service';

@Module({
  controllers: [UserController],
  providers: [Logger, PrismaService, UserService],
})
export class UserModule {}
