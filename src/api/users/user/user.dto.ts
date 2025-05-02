import { Escape, Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { isRegExp } from 'util/types';

export class RegiserUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @Trim()
  @Escape()
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(6)
  @Escape()
  @Trim()
  password: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  @Escape()
  first_name: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  @Escape()
  last_name: string;

  @IsNotEmpty()
  @IsUUID()
  city_id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2)
  @Trim()
  @Escape()
  language_code: string;
}

export class UpdateUserProfileDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  @Escape()
  first_name: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  @Escape()
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(2)
  @Trim()
  @Escape()
  language_code: string;

  @IsNotEmpty()
  @IsUUID()
  city_id: string;

  @IsOptional()
  @IsUUID()
  service_id?: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  @Trim()
  @Escape()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Trim()
  @Escape()
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Trim()
  @Escape()
  bio?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  @Trim()
  @Escape()
  contactEmail?: string;

  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(100)
  @Trim()
  @Escape()
  contactPhone?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(100)
  @Trim()
  @Escape()
  website?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+\/?$/, {
    message: 'Invalid Instagram URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  instagram?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(t\.me|telegram\.me)\/[A-Za-z0-9_]+\/?$/, {
    message: 'Invalid Telegram URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  telegram?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(www\.)?viber\.com\/[A-Za-z0-9_/?=]+$/, {
    message: 'Invalid Viber URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  viber?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(wa\.me|api\.whatsapp\.com)\/[0-9]+$/, {
    message: 'Invalid WhatsApp URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  whatsapp?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/, {
    message: 'Invalid LinkedIn URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  linkedin?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(www\.)?tiktok\.com\/@?[A-Za-z0-9_.]+\/?$/, {
    message: 'Invalid TikTok URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  tiktok?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.]+\/?$/, {
    message: 'Invalid Facebook URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  facebook?: string;

  @IsOptional()
  @Matches(/^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+\/?$/, {
    message: 'Invalid Twitter URL',
  })
  @MaxLength(200)
  @Trim()
  @Escape()
  twitter?: string;
}
