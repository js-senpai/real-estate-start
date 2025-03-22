import { Escape, Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  firstName: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  @Trim()
  @Escape()
  lastName: string;

  @IsNotEmpty()
  @IsUUID()
  countryId: string;
}
