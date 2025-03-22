import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './auth.dto';
import * as argon2 from 'argon2';
import { PrismaService } from '@common/services/prisma.service';
import { IAuth, IRefreshTokenAuth } from '@common/interfaces/auth.interfaces';
import { IResponseOk } from '@common/interfaces/common.interface';
import { JwtService } from '@nestjs/jwt';
import dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: AuthDto): Promise<IAuth> {
    const user = await this.prismaService.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) {
      throw new NotAcceptableException('Password invalid');
    }
    return await this.generateTokens(user);
  }

  async loginGoogle({
    email,
    firstName,
    lastName,
  }: Pick<users, 'email' | 'firstName' | 'lastName'>): Promise<IAuth> {
    const user = await this.prismaService.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
      },
    });
    if (!user) {
      const newUser = await this.prismaService.user.create({
        data: {
          email,
          firstName,
          lastName,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          countryId: true,
        },
      });
      return await this.generateTokens(newUser);
    }
    return await this.generateTokens(user);
  }

  async generateTokens(user: Pick<users, 'id' | 'email'>) {
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  async logout(userId: string): Promise<IResponseOk> {
    const getUser = await this.prismaService.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });
    if (!getUser) {
      throw new NotFoundException('User not found');
    }
    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: '',
      },
    });
    return {
      ok: 'The session has successfully destroyed',
    };
  }

  async refreshTokens({ id, refreshToken }: IRefreshTokenAuth) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        password: true,
        refreshToken: true,
      },
    });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken({
      id: user.id,
      refreshToken: tokens.refreshToken,
    });
    return tokens;
  }

  async updateRefreshToken({ id, refreshToken }: IRefreshTokenAuth) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }
  hashData(data: string) {
    return argon2.hash(data);
  }
  async getTokens(user: Pick<users, 'id' | 'email'>) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          email: user.email,
          sub: user.id,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '30d',
        },
      ),
      this.jwtService.signAsync(
        {
          email: user.email,
          sub: user.id,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '60d',
        },
      ),
    ]);

    return {
      accessToken,
      accessTokenExpire: dayjs().add(1, 'd').unix(),
      refreshToken,
      refreshTokenExpire: dayjs().add(7, 'd').unix(),
    };
  }
}
