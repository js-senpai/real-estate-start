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
    countryId,
    firstName,
    lastName,
  }: RegiserUserDto) {
    const checkUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (checkUser) {
      throw new ForbiddenException('User already exists');
    }
    const checkCountry = await this.prismaService.country.findUnique({
      where: { id: countryId },
    });
    if (!checkCountry) {
      throw new NotFoundException('Country not found');
    }
    const hashedPassword = await argon2.hash(password);
    return await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        countryId,
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
  }
}
