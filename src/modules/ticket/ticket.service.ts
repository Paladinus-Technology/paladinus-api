import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';

import { Company } from '../company/entities/company.entity'; // Ajuste o caminho conforme a sua estrutura de pastas
import { User } from '../user/entities/user.entity'; // Ajuste o caminho conforme seu projeto
import { Ticket } from './entities/ticket.entity';

import { JwtPayload } from 'src/auth/jwt/jwt.payload.interface';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: MongoRepository<Ticket>,
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: MongoRepository<Company>,
  ) {}

  private async findUserById(id: string) {
    return this.userRepository.findOne({
      where: { _id: new ObjectId(id) } as any,
    });
  }

  async create(createTicketDto: CreateTicketDto, user: JwtPayload) {
    const dataUser = await this.findUserById(user.id);
    if (!dataUser) {
      throw new NotFoundException('User not found');
    }

    const dataCompany = await this.companyRepository.findOne({
      where: { _id: new ObjectId(dataUser.companyId) } as any,
    });

    // Exemplo de criação de ticket utilizando o TypeORM
    const newTicket = this.ticketRepository.create({
      title: createTicketDto.title,
      description: createTicketDto.description,
      companyId: dataUser.companyId,
      createdById: user.id,
    });

    await this.ticketRepository.save(newTicket);

    return { dataCompany };
  }

  async findAll() {
    // Busca todos os tickets ordenados por data de criação decrescente
    const tickets = await this.ticketRepository.find({
      order: { createdAt: 'DESC' } as any,
    });

    // Como o MongoDB armazena IDs e referências, buscamos os dados relacionados correspondentes
    const data = await Promise.all(
      tickets.map(async (ticket) => {
        const company = await this.companyRepository.findOne({
          where: { _id: new ObjectId(ticket.companyId) } as any,
        });
        const createdBy = await this.userRepository.findOne({
          where: { _id: new ObjectId(ticket.createdById) } as any,
        });

        return {
          title: ticket.title,
          status: ticket.status,
          company: company?.name || 'Unknown',
          createdBy: createdBy?.name || 'Unknown',
        };
      }),
    );

    return { data };
  }

  async findAllToClient(id: string) {
    const dataUser = await this.findUserById(id);
    if (!dataUser) {
      throw new NotFoundException('User not found');
    }

    const tickets = await this.ticketRepository.find({
      where: { companyId: dataUser.companyId } as any,
      order: { createdAt: 'DESC' } as any,
    });

    const company = await this.companyRepository.findOne({
      where: { _id: new ObjectId(dataUser.companyId) } as any,
    });

    const data = await Promise.all(
      tickets.map(async (ticket) => {
        const createdBy = await this.userRepository.findOne({
          where: { _id: new ObjectId(ticket.createdById) } as any,
        });

        return {
          title: ticket.title,
          status: ticket.status,
          company: company?.name || 'Unknown',
          createdBy: createdBy?.name || 'Unknown',
        };
      }),
    );

    return { data };
  }

  findOne(id: string) {
    return `This action returns a #${id} ticket`;
  }

  update(id: string, updateTicketDto: UpdateTicketDto) {
    return `This action updates a #${id} ticket`;
  }

  remove(id: string) {
    return `This action removes a #${id} ticket`;
  }
}
