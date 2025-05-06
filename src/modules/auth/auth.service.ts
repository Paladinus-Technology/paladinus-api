import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/Login.dto';
// import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto): string {
    return `This User ${loginDto.email} sussecc Full`;
  }
}
