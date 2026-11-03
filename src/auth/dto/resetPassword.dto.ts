import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
export class ResetPasswordDto {
  @IsString()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Code is required.' })
  code!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long.' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must include uppercase, lowercase, number, and special character.',
  })
  password!: string;
}
