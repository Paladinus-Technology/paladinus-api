import { Body, Controller, Post, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TypeCode } from 'src/common/enum/type-code.enum';
import { FinishSignupDto } from 'src/common/interfaces/finishSignup';
import { AuthService } from './auth.service';
import { ClientCreateDto } from './dto/client-register.dto';
import { EmailDto } from './dto/email.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('login/request-code')
  loginEmail(@Body() email: EmailDto) {
    return this.authService.requestCode(TypeCode.emailCode, email);
  }

  @Post('login/verify-code')
  verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto.email, dto.code);
  }

  @Post('password-recovery')
  async recoveryPassword(@Body() email: EmailDto) {
    return this.authService.requestCode(TypeCode.resetPassword, email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // @Public()
  // @Post('register/master')
  // masterRegister(@Body() masterCreatedDto: MasterCreateDto) {
  //   return this.authService.createMaster(masterCreatedDto);
  // }

  @Post('finish-signup')
  async finishSignup(
    @Body() clientCreateDto: ClientCreateDto,
    @Query('token') token: string,
  ) {
    const payload: FinishSignupDto =
      await this.authService.verifyTokenFinishSignup(token);

    return this.authService.createClient(payload, clientCreateDto);
  }
}
