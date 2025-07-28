import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Deposit } from './deposit.entity';
import { Transfer } from './transfer.entity';
import { Withdrawal } from './withdrawal.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('int')
  balance: number;

  @OneToMany(() => Deposit, (deposit) => deposit)
  deposits: Deposit[];

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal)
  withdrawals: Withdrawal[];

  @OneToMany(() => Transfer, (transfer) => transfer)
  tranfers: Transfer[];

  @Column('date')
  createdAt: Date;
}
