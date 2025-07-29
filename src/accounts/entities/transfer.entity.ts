import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.transfersOut)
  accountFrom: Account;

  @ManyToOne(() => Account, (account) => account.transfersIn)
  accountTo: Account;

  @Column('int')
  amount: number;
}
