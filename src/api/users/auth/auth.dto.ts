import { Escape, Trim } from 'class-sanitizer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  @Escape()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(6)
  @Trim()
  @Escape()
  password: string;
}
