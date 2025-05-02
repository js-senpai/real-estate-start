import {
  Body,
  Controller,
  Logger,
  Post,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegiserUserDto, UpdateUserProfileDto } from './user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '@common/guards/jwt.guard';

@Controller({
  version: '0',
  path: '/user',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async register(@Body() data: RegiserUserDto) {
    try {
      return await this.userService.registerUser(data);
    } catch (e) {
      this.logger.error(
        'Error in register method',
        JSON.stringify(e?.response?.data || e?.response?.data || e.stack),
        UserController.name,
      );
      throw e;
    }
  }

  @Post('/profile')
  @UseGuards(JwtGuard)
  async updateProfile(@Body() data: UpdateUserProfileDto, @Req() { user }) {
    try {
      return await this.userService.updateProfile({
        ...data,
        id: user.id,
      });
    } catch (e) {
      this.logger.error(
        'Error in updateProfile method',
        JSON.stringify(e?.response?.data || e?.response?.data || e.stack),
        UserController.name,
      );
      throw e;
    }
  }

  @Get('/profile')
  @UseGuards(JwtGuard)
  async getProfile(@Req() { user }) {
    try {
      return await this.userService.get(user.id);
    } catch (e) {
      this.logger.error(
        'Error in getProfile method',
        JSON.stringify(e?.response?.data || e?.response?.data || e.stack),
        UserController.name,
      );
      throw e;
    }
  }
}
