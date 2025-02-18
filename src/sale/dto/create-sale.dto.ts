import { IsEnum, IsNotEmpty, IsNumber, IsPositive, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSaleItemDto } from './create-sale-item.dto';
import { IsExist } from '../../common/validator/exist.validator';
import { Customer } from '../../customer/entities/customer.entity';
import { User } from '../../user/entities/user.entity';

export enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
  QRIS = 'qris',
}

export class CreateSaleDto {
  @ApiProperty({ required: true, example: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f' })
  @IsNotEmpty()
  @IsExist([Customer, 'id'])
  customer_id: string;

  @ApiProperty({ required: true, example: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f' })
  @IsNotEmpty()
  @IsExist([User, 'id'])
  user_id: string;

  @ApiProperty({ required: true, example: '2025-02-18' })
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'purchase_date must be in the format yyyy-MM-dd' })
  purchase_date: string;

  @ApiProperty({ required: true, example: 12000 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  payment_amount: number;

  @ApiProperty({ required: true, example: 'cash' })
  @IsNotEmpty()
  @IsEnum(PaymentMethod, {
    message: 'payment_method must be one of the following: cash, transfer, qris',
  })
  payment_method: PaymentMethod;

  @ApiProperty({
    required: true,
    type: [CreateSaleItemDto],
    example: [
      {
        product_id: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f',
        stock: 1,
      },
      {
        product_id: 'a65d6e9f-7f5b-4d8b-8533-bcdd9900b5b1',
        stock: 2,
      },
    ],
  })
  @IsNotEmpty()
  products: CreateSaleItemDto[];
}
