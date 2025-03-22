import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Logger } from 'winston';
import { AuthDto } from './auth.dto';
import { IAuth } from '@common/interfaces/auth.interfaces';
import { GoogleAuthResult, UseGoogleAuth } from '@nestjs-hybrid-auth/google';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { JwtGuard } from '@common/guards/jwt.guard';
import { RefreshJwtAuthGuard } from '@common/guards/refresh-jwt.guard';
import dayjs from 'dayjs';

@Controller({
  version: '0',
  path: '/auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async auth(@Body() data: AuthDto): Promise<IAuth> {
    return await this.authService.login(data);
  }

  @UseGoogleAuth()
  @Get('google')
  async googleAuth() {}

  @UseGoogleAuth()
  @Get('google/callback')
  async googleAuthRedirect(@Req() req, @Res() res: Response): Promise<void> {
    try {
      const result: GoogleAuthResult = req.hybridAuthResult;
      const { accessToken, refreshToken } = await this.authService.loginGoogle({
        email: result?.profile?.emails[0].value,
        firstName: result?.profile?.name?.givenName,
        lastName: result?.profile?.name?.familyName,
      });
      res.cookie('accessToken', accessToken, {
        domain: this.configService
          .get('FRONTEND_URL')
          .replaceAll('https://', ''),
        maxAge: dayjs().add(30, 'd').unix(),
      });
      res.cookie('refreshToken', refreshToken, {
        domain: this.configService
          .get('FRONTEND_URL')
          .replaceAll('https://', ''),
        maxAge: dayjs().add(60, 'd').unix(),
      });
      res.redirect(`${this.configService.get('FRONTEND_URL')}/`);
    } catch (e) {
      this.logger.error(
        'Error in googleAuthRedirect method.',
        e,
        AuthController.name,
      );
      throw e;
    }
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  async logout(@Req() req: Request) {
    return await this.authService.logout(req.user['sub']);
  }
  @Get('/validate')
  @UseGuards(JwtGuard)
  async validateUser(@Req() { user }): Promise<users> {
    return user;
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens({
      id: userId,
      refreshToken,
    });
  }
}
