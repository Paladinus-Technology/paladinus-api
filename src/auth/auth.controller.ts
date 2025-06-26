import { Body, Controller, Post } from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { getUserToken } from 'src/common/decorators/getUserToken.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmailPayload } from 'src/common/interfaces/EmailPayload';
import { AuthService } from './auth.service';
import { ClientCreateDto } from './dto/client-tegister.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { MasterCreateDto } from './dto/master-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  signIn(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.signIn(createAuthDto);
  }

  @Roles(UserRole.MASTER)
  @Post('register/master')
  masterRegister(@Body() masterCreatedDto: MasterCreateDto) {
    return this.authService.createMaster(masterCreatedDto);
  }

  @Roles(UserRole.CLIENT)
  @Post('register/client')
  clientRegister(
    @Body() clientCreateDto: ClientCreateDto,
    @getUserToken() tokenEmail: EmailPayload,
  ) {
    return this.authService.createClient(tokenEmail, clientCreateDto);
  }
}
