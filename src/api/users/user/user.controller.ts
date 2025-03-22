import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegiserUserDto } from './user.dto';
import { ConfigService } from '@nestjs/config';

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
}
