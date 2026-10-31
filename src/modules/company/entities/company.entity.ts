import { ApiHideProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
} from 'typeorm';

export class CompanyEmailEmbedded {
  @Column()
  email!: string;
}

@Entity('company')
export class Company {
  @ApiHideProperty()
  @ObjectIdColumn()
  _id!: ObjectId;

  get id(): string {
    return this._id.toHexString();
  }

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  cnpj!: string;

  @Column()
  location!: string;

  @Column(() => CompanyEmailEmbedded)
  emails!: CompanyEmailEmbedded[];

  @CreateDateColumn()
  createdAt!: Date;
}
