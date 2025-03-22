import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleAuthModuleOptions } from '@nestjs-hybrid-auth/google';

export const googleAuthConfig = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<GoogleAuthModuleOptions> => ({
    clientID: configService.get('GOOGLE_CLIENT_ID'),
    clientSecret: configService.get('GOOGLE_SECRET'),
    callbackURL: `${configService.get('BACKEND_URL')}/v0/auth/google/callback`,
    scope: ['email', 'profile'],
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
};
