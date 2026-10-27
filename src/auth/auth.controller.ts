import { Body, Controller, Post } from '@nestjs/common';
import { getUserToken } from 'src/common/decorators/getUserToken.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { EmailPayload } from 'src/common/interfaces/EmailPayload';
import { AuthService } from './auth.service';
import { ClientCreateDto } from './dto/client-tegister.dto';
import { EmailLoginDto } from './dto/email-login.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Public()
  @Post('/login/request-code')
  loginEmail(@Body() email: EmailLoginDto) {
    return this.authService.requestCodeLogin(email);
  }

  @Public()
  @Post('/login/verify-code')
  verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto.email, dto.code);
  }
  // @Public()
  // @Post('register/master')
  // masterRegister(@Body() masterCreatedDto: MasterCreateDto) {
  //   return this.authService.createMaster(masterCreatedDto);
  // }
  @Post('register/client')
  clientRegister(
    @Body() clientCreateDto: ClientCreateDto,
    @getUserToken() tokenEmail: EmailPayload,
  ) {
    return this.authService.createClient(tokenEmail, clientCreateDto);
  }
}
