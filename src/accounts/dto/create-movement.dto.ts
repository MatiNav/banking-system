import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

const MOVEMENT_TYPES = ['deposit', 'transfer', 'withdrawal'] as const;

export class CreateMovementDto {
  @IsIn(MOVEMENT_TYPES)
  type: (typeof MOVEMENT_TYPES)[number];

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  accountTo?: string;
}
