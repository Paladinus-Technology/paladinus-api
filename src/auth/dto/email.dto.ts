import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email!: string;
}
