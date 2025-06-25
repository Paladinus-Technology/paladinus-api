import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.interface';
import { EmailPayload } from '../interfaces/EmailPayload';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  sing(payload: JwtPayload) {
    const access_token = this.jwt.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
    });
    const refresh_token = this.jwt.sign(
      { id: payload.id, role: payload.role },
      { expiresIn: this.configService.get<string>('JWT_EXPIRATION_WEEK') },
    );

    return { access_token, refresh_token };
  }

  TokenFromEmail(payload: EmailPayload) {
    const token = this.jwt.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_INVITE'),
    });

    return { token };
  }
}
