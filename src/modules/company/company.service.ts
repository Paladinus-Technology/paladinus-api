import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: MongoRepository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const company = this.companyRepository.create({
        name: createCompanyDto.name,
        cnpj: createCompanyDto.cnpj,
        location: createCompanyDto.location,
        emails: [], // Inicializa o array de emails embutidos vazio
      });

      await this.companyRepository.save(company);
    } catch (error) {
      throw new BadRequestException(error);
    }
    return `This action adds a new ${createCompanyDto.name}`;
  }

  async findAll() {
    const data = await this.companyRepository.find();
    return { data };
  }

  async findOne(id: string) {
    const company = await this.companyRepository.findOne({
      where: { _id: new ObjectId(id) } as any,
    });

    if (!company) {
      throw new NotFoundException(`Company with ID #${id} not found`);
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    const company = await this.findOne(id);

    Object.assign(company, updateCompanyDto);
    await this.companyRepository.save(company);

    return `This action updates a #${id} company`;
  }

  async remove(id: string) {
    const company = await this.findOne(id);
    await this.companyRepository.delete(company._id);

    return `This action removes a #${id} company`;
  }
}
