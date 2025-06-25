import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      await this.prisma.company.create({
        data: {
          name: createCompanyDto.name,
          cnpj: createCompanyDto.cnpj,
          location: createCompanyDto.location,
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
    return `This action adds a new ${createCompanyDto.name}`;
  }

  async findAll() {
    const data = await this.prisma.company.findMany();
    return { data };
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
