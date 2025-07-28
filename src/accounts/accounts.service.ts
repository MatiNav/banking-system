import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountsService {
  private logger = new Logger('AccountService');

  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
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

  findOne(id: string) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  handleException(error: any): never {
    if ('code' in error && error.code === 11000) {
      throw new BadRequestException(`Account already exists.`);
    }

    throw new InternalServerErrorException(
      'Something went wrong please contact support.',
    );
  }
}
