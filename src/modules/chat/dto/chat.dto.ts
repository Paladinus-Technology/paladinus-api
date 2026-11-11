import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
export class ChatDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsNotEmpty()
  message!: string;
}
