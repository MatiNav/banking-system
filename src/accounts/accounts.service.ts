import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { type } from 'os';
import { DataSource, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateMovementDto } from './dto/create-movement.dto';
import { Account } from './entities/account.entity';
import { Deposit } from './entities/deposit.entity';
import { Transfer } from './entities/transfer.entity';
import { Withdrawal } from './entities/withdrawal.entity';

@Injectable()
export class AccountsService {
  private logger = new Logger('AccountService');

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    private readonly datasource: DataSource,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const account = this.accountRepository.create(createAccountDto);

    try {
      return await this.accountRepository.save(account);
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all accounts`;
  }

  async findOne(id: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: {
        deposits: true,
        withdrawals: true,
        transfersIn: true,
        transfersOut: true,
      },
    });

    if (!account) {
      throw new NotFoundException(`Account with id: "${id}" not found.`);
    }

    return account;
  }

  async createMovement(
    accountId: string,
    createMovementDto: CreateMovementDto,
  ) {
    try {
      const account = await this.findOne(accountId);

      switch (createMovementDto.type) {
        case 'deposit':
        case 'withdrawal':
          await this.createDepositOrWithdrawal(
            createMovementDto.amount,
            createMovementDto.type,
            account,
          );
          break;
        case 'transfer':
          await this.createTransfer(
            createMovementDto.amount,
            account,
            createMovementDto.accountTo,
          );
          break;
        default:
          throw new BadRequestException(`Type ${type} not found.`);
      }

      return await this.findOne(account.id);
    } catch (error) {
      this.handleException(error);
    }
  }

  async createDepositOrWithdrawal(
    amount: number,
    type: 'deposit' | 'withdrawal',
    account: Account,
  ) {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let entity: EntityClassOrSchema, accountMovementType: Array<any>;
      if (type === 'deposit') {
        entity = Deposit;
        accountMovementType = account.deposits;
      } else {
        entity = Withdrawal;
        accountMovementType = account.withdrawals;
      }

      const movement = queryRunner.manager.create(entity, { amount, account });
      account.balance =
        type === 'deposit'
          ? account.balance + amount
          : account.balance - amount;

      if (account.balance < 0) {
        throw new BadRequestException('Balance can not be negative');
      }

      accountMovementType.push(movement);

      console.log(entity, 'entity');
      console.log(movement, 'movement');
      await queryRunner.manager.save(movement);
      await queryRunner.manager.save(account);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleException(error);
    }
  }

  async createTransfer(amount: number, account: Account, accountTo?: string) {
    if (!accountTo) throw new BadRequestException(`Missing field "accountTo".`);

    const queryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const accountToDB = await this.findOne(accountTo);

      const transfer = queryRunner.manager.create(Transfer, {
        amount,
        accountFrom: account,
        accountTo: accountToDB,
      });
      account.balance = account.balance - amount;
      accountToDB.balance = accountToDB.balance + amount;

      if (account.balance < 0) {
        throw new BadRequestException(`Balance can not be negative.`);
      }

      account.transfersIn.push(transfer);

      await Promise.all([
        queryRunner.manager.save(account),
        queryRunner.manager.save(accountToDB),
      ]);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleException(error);
    }
  }

  handleException(error: any): never {
    this.logger.log(error.message || 'An error occurred');

    if ('code' in error && error.code == 23505) {
      throw new BadRequestException(`Account already exists.`);
    }

    throw error;
  }
}
