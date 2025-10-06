import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRole } from 'generated/prisma';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.interface';
import { getUserToken } from 'src/common/decorators/getUserToken.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketService } from './ticket.service';

@Roles(UserRole.CLIENT, UserRole.MASTER)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  create(
    @Body() createTicketDto: CreateTicketDto,
    @getUserToken() user: JwtPayload,
  ) {
    return this.ticketService.create(createTicketDto, user);
  }

  @Get()
  findAll(@getUserToken() user: JwtPayload) {
    if (user.role === UserRole.CLIENT)
      return this.ticketService.findAllToClient(user.id);

    return this.ticketService.findAll();
  }
}
