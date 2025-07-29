import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Deposit } from './deposit.entity';
import { Transfer } from './transfer.entity';
import { Withdrawal } from './withdrawal.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('float', { default: 0 })
  @Check('balance >= 0')
  balance: number;

  @OneToMany(() => Deposit, (deposit) => deposit.account, {
    cascade: true,
  })
  deposits: Deposit[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.account, {
    cascade: true,
  })
  withdrawals: Withdrawal[];

  @OneToMany(() => Transfer, (transfer) => transfer.accountTo, {
    cascade: true,
  })
  transfersIn: Transfer[];

  @OneToMany(() => Transfer, (transfer) => transfer.accountFrom, {
    cascade: true,
  })
  transfersOut: Transfer[];

  @Column('date', { default: () => 'CURRENT_DATE' })
  createdAt: Date;
}
