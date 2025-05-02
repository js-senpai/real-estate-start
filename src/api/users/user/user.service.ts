import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { RegiserUserDto, UpdateUserProfileDto } from './user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async registerUser({
    email,
    password,
    city_id,
    first_name,
    last_name,
    language_code,
  }: RegiserUserDto) {
    const checkUser = await this.prismaService.users.findUnique({
      where: { email },
    });
    if (checkUser) {
      throw new ForbiddenException('User is already exists');
    }
    const checkCity = await this.prismaService.cities.findUnique({
      where: { id: city_id },
      select: {
        id: true,
      },
    });
    if (!checkCity) {
      throw new NotFoundException('City is not found');
    }
    const checkLanguage = await this.prismaService.languages.findUnique({
      where: { code: language_code },
      select: {
        id: true,
      },
    });
    if (!checkLanguage) {
      throw new NotFoundException(
        `Language with code "${language_code}" is not found`,
      );
    }
    const hashedPassword = await argon2.hash(password);
    return await this.prismaService.users.create({
      data: {
        email,
        password: hashedPassword,
        city_id,
        first_name,
        last_name,
        language_id: checkLanguage.id,
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        city_id: true,
        language_id: true,
      },
    });
  }

  async get(id: string) {
    const getUser = await this.prismaService.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        city_id: true,
        language_id: true,
        service_id: true,
        location: true,
        bio: true,
        contactEmail: true,
        contactPhone: true,
        website: true,
        instagram: true,
        telegram: true,
        viber: true,
        whatsapp: true,
        linkedin: true,
        tiktok: true,
        facebook: true,
        twitter: true,
      },
    });
    if (!getUser) {
      throw new NotFoundException('User is not found');
    }
    return getUser;
  }

  async updateProfile({
    id,
    email,
    first_name,
    last_name,
    city_id,
    language_code,
    service_id,
    location = '',
    bio = '',
    contactEmail = '',
    contactPhone = '',
    website = '',
    instagram = '',
    telegram = '',
    viber = '',
    whatsapp = '',
    linkedin = '',
    tiktok = '',
    facebook = '',
    twitter = '',
  }: UpdateUserProfileDto & { id: string }) {
    const checkUser = await this.prismaService.users.findUnique({
      where: { id },
      select: {
        email: true,
      },
    });
    if (!checkUser) {
      throw new NotFoundException('User is not found');
    }
    if (checkUser.email !== email) {
      const checkEmail = await this.prismaService.users.findUnique({
        where: { email, NOT: { id } },
        select: {
          id: true,
        },
      });
      if (checkEmail) {
        throw new ForbiddenException('Email is already exists');
      }
    }
    const checkCity = await this.prismaService.cities.findUnique({
      where: { id: city_id },
      select: {
        id: true,
      },
    });
    if (!checkCity) {
      throw new NotFoundException('City is not found');
    }
    const checkLanguage = await this.prismaService.languages.findUnique({
      where: { code: language_code },
      select: {
        id: true,
      },
    });
    if (!checkLanguage) {
      throw new NotFoundException(
        `Language with code "${language_code}" is not found`,
      );
    }
    if (service_id) {
      const checkService = await this.prismaService.services.findUnique({
        where: { id: service_id },
        select: {
          id: true,
        },
      });
      if (!checkService) {
        throw new NotFoundException('Service is not found');
      }
    }
    await this.prismaService.users.update({
      where: {
        id,
      },
      data: {
        email,
        first_name,
        last_name,
        city_id,
        language_id: checkLanguage.id,
        service_id,
        location,
        bio,
        contactEmail,
        contactPhone,
        website,
        instagram,
        telegram,
        viber,
        whatsapp,
        linkedin,
        tiktok,
        facebook,
        twitter,
      },
    });
    return {
      ok: 'The user has successfully updated',
    };
  }
}
