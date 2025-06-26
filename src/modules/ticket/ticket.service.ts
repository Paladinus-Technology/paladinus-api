import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}
  async create(createTicketDto: CreateTicketDto, user: JwtPayload) {
    const dataUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    const dataCompany = await this.prisma.company.findUnique({
      where: { id: dataUser?.companyId },
    });
    return { dataCompany };
  }

  async findAll() {
    const data = await this.prisma.ticket.findMany();
    return { data };
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
