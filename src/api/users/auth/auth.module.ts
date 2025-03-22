import { Module, Logger } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtFactory } from 'src/common/configs/jwt.config';
import { GoogleAuthModule } from '@nestjs-hybrid-auth/google';
import { googleAuthConfig } from 'src/common/configs/google-auth.config';
import { PrismaService } from '../../../common/services/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    GoogleAuthModule.forRootAsync(googleAuthConfig),
  ],
  controllers: [AuthController],
  providers: [Logger, PrismaService, AuthService],
})
export class AuthModule {}
