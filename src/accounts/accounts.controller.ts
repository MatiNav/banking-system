import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CreateMovementDto } from './dto/create-movement.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get(':accountId')
  findOne(@Param('accountId') accountId: string) {
    return this.accountsService.findOne(accountId);
  }

  @Post('/:accountId/movements')
  createMovement(
    @Param('accountId') accountId: string,
    @Body() createMovementDto: CreateMovementDto,
  ) {
    return this.accountsService.createMovement(accountId, createMovementDto);
  }
}

/**
 * Get accounts/:id => get an account and its last 100 movements
 * Delete accounts/:id
 * Put accounts/:id => modifies its settings
 *
 * Post accounts/movements/
 * (transfer, deposit / withdrawal)
 */
