import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class CreateCompanyDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsString()
  cnpj!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUserDto)
  users?: CreateUserDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];
  // tickets?:
}
