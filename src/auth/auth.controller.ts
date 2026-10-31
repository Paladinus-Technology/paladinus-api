import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { TypeCode } from 'src/common/enum/type-code.enum';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/email.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
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
    console.log('chegou no controler');
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

  // @Public()
  // @Post('register/master')
  // masterRegister(@Body() masterCreatedDto: MasterCreateDto) {
  //   return this.authService.createMaster(masterCreatedDto);
  // }

  // @Post('register/client')
  // clientRegister(
  //   @Body() clientCreateDto: ClientCreateDto,
  //   @getUserToken() tokenEmail: EmailPayload,
  // ) {
  //   return this.authService.createClient(tokenEmail, clientCreateDto);
  // }
}
