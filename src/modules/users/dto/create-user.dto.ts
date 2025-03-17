import { Role } from '@prisma/client';
import { IsAlphanumeric, IsEmail, IsEnum, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio!' })
  name!: string;

  @IsNotEmpty({ message: 'O campo nome não pode estar vazio!' })
  @IsEmail({}, { message: 'O campo email precisa ter um formato valido!' })
  email!: string;

  @IsNotEmpty({ message: 'O campo senha não pode estar vazio!' })
  @IsAlphanumeric('pt-BR', { message: 'A senha só pode conter letras e numeros!' })
  @Length(8, 60, { message: 'A senha precisa conter entre 8 e 25' })
  password!: string;

  @IsNotEmpty()
  customerId!: string;

  @IsEnum(Role)
  role!: Role;
}
