import { IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Formado de email invalido!' })
  email!: string;
  password!: string;
}
