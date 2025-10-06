import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/jwt/jwt.payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}
  private findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(createTicketDto: CreateTicketDto, user: JwtPayload) {
    const dataUser = await this.findUserById(user.id);
    const dataCompany = await this.prisma.company.findUnique({
      where: { id: dataUser?.companyId },
    });
    return { dataCompany };
  }

  async findAll() {
    const dataBank = await this.prisma.ticket.findMany({
      select: {
        title: true,
        status: true,
        company: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = dataBank.map((ticket) => ({
      title: ticket.title,
      status: ticket.status,
      company: ticket.company.name,
      createdBy: ticket.createdBy.name,
    }));
    return { data };
  }

  async findAllToClient(id: string) {
    const dataUser = await this.findUserById(id);
    const dataBank = await this.prisma.ticket.findMany({
      where: { companyId: dataUser?.companyId },
      select: {
        title: true,
        status: true,
        company: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const data = dataBank.map((ticket) => ({
      title: ticket.title,
      status: ticket.status,
      company: ticket.company.name,
      createdBy: ticket.createdBy.name,
    }));
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
