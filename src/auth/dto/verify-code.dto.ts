import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Code is required.' })
  code!: string;
}
