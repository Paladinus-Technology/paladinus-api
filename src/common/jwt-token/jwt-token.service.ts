import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.interface';
import { EmailPayload } from '../interfaces/EmailPayload';

@Injectable()
export class JwtTokenService {
  private readonly authSecret: string;
  private readonly authExpirationTime: string;

  private readonly inviteSecret: string;
  private readonly inviteExpirationTime: string;

  private readonly loginEmailExpirationTime: string;
  private readonly loginEmailSecret: string;

  constructor(
    private readonly jwt: JwtService,
    private configService: ConfigService,
  ) {
    this.authSecret = this.configService.getOrThrow<string>('JWT_AUTH_SECRET');
    this.authExpirationTime = this.configService.getOrThrow<string>(
      'JWT_AUTH_SECRET_EXPIRATION_TIME',
    );

    this.inviteSecret =
      this.configService.getOrThrow<string>('JWT_INVITE_SECRET');
    this.inviteExpirationTime = this.configService.getOrThrow<string>(
      'JWT_EXPIRATION_INVITE',
    );

    this.loginEmailSecret = this.configService.getOrThrow<string>(
      'JWT_LOGIN_EMAIL_SECRET',
    );
    this.loginEmailExpirationTime = this.configService.getOrThrow<string>(
      'JWT_EXPIRATION_LOGIN_EMAIL',
    );
  }

  singAuth(payload: JwtPayload) {
    const access_token = this.jwt.sign(payload, {
      secret: this.authSecret,
      expiresIn: this.authExpirationTime,
    });

    return { access_token };
  }

  TokenInviteEmail(payload: EmailPayload) {
    const token = this.jwt.sign(payload, {
      secret: this.inviteSecret,
      expiresIn: this.inviteExpirationTime,
    });

    return { token };
  }
}
