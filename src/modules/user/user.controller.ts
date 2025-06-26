import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserRole } from 'generated/prisma';
import { Roles } from 'src/common/decorators/roles.decorator';
import { InviteClientDto } from './dto/invite-client.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRole.MASTER)
  @Post('invite/client')
  invite(@Req() req: Request, @Body() inviteClient: InviteClientDto) {
    const origin = (req.headers.origin as string) ?? (req.headers.referer as string);

    return this.userService.invite(inviteClient, origin);
  }

  @Roles(UserRole.MASTER)
  @Get()
  findAll() {
    return this.userService.findAll();
  }
}
