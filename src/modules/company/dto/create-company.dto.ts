import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsString()
  cnpj!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];
}
