import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { Deposit } from './entities/deposit.entity';
import { Transfer } from './entities/transfer.entity';
import { Withdrawal } from './entities/withdrawal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, Deposit, Withdrawal, Transfer])],
  controllers: [AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
