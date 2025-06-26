import { IsEmail, IsNotEmpty } from 'class-validator';

export class InviteClientDto {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email!: string;

  @IsNotEmpty({ message: 'Name is required.' })
  companyId!: string;
}
