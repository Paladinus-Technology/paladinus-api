import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Token } from './entities/token.entity'; // Ajuste o caminho conforme a sua estrutura de pastas

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: MongoRepository<Token>,
  ) {}

  async createToken(token: string, email: string) {
    try {
      let tokenEntity = await this.tokenRepository.findOne({
        where: { email },
      });

      if (tokenEntity) {
        tokenEntity.token = token;
      } else {
        tokenEntity = this.tokenRepository.create({ email, token });
      }

      return await this.tokenRepository.save(tokenEntity);
    } catch (err) {
      throw new InternalServerErrorException(`Failed to create token: ${err}`);
    }
  }

  async findByEmail(email: string): Promise<Token | null> {
    return await this.tokenRepository.findOne({ where: { email } });
  }

  async deleteCode(email: string) {
    await this.tokenRepository.deleteOne({ email });
  }
}
