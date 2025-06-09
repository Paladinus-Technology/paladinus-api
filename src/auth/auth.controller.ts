import { Body, Controller, Post } from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthService } from './auth.service';
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

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // // @Patch(':id')
  // // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  // //   return this.authService.update(+id, updateAuthDto);
  // // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
