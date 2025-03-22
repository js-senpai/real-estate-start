import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { RegiserUserDto } from './user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async registerUser({
    email,
    password,
    country_id,
    first_name,
    last_name,
  }: RegiserUserDto) {
    const checkUser = await this.prismaService.users.findUnique({
      where: { email },
    });
    if (checkUser) {
      throw new ForbiddenException('User already exists');
    }
    const checkCountry = await this.prismaService.countries.findUnique({
      where: { id: country_id },
    });
    if (!checkCountry) {
      throw new NotFoundException('Country not found');
    }
    const hashedPassword = await argon2.hash(password);
    return await this.prismaService.users.create({
      data: {
        email,
        password: hashedPassword,
        country_id,
        first_name,
        last_name,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        country_id: true,
      },
    });
  }
}
