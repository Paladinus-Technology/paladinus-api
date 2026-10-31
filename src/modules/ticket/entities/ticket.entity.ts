import { ApiHideProperty } from '@nestjs/swagger';
import { TicketStatus } from 'src/common/enum/ticket-status.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tickets')
export class Ticket {
  @ApiHideProperty()
  @ObjectIdColumn()
  _id!: ObjectId;

  get id(): string {
    return this._id.toHexString();
  }

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.ABERTO })
  status!: TicketStatus;

  @Column()
  companyId!: string;

  @Column()
  createdById!: string; // ID do User que criou

  @Column({ nullable: true })
  solution?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
