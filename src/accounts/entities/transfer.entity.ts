import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account)
  @Index('account_from_index')
  accountFrom: Account;

  @ManyToOne(() => Account)
  @Index('account_to_index')
  accountTo: Account;

  @Column('int')
  amount: number;
}
