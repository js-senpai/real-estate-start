import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../services/prisma.service';
import { IAuthPayload } from '@common/interfaces/auth.interfaces';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    protected readonly prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: IAuthPayload) {
    const { sub } = payload;
    const user = await this.prismaService.users.findUnique({
      where: { id: sub },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    const { email, id, first_name, last_name } = user;
    return {
      email,
      sub: id,
      first_name,
      last_name,
    };
  }
}
