import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/common/decorators/roles.decorator';
import { InviteClientDto } from './dto/invite-client.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.MASTER)
  @Post('invite/client')
  invite(@Body() inviteClient: InviteClientDto) {
    return this.userService.invite(inviteClient);
  }

  @Roles(UserRole.MASTER)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
