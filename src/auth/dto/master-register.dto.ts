import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class MasterCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(200, { message: 'Name can be only 200 characters long' })
  name!: string;

  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long.' })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must include uppercase, lowercase, number, and special character.',
  })
  password!: string;
}
