import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsUnique } from '../../common/validator/unique.validator';
import { Customer } from '../entities/customer.entity';

export class CreateCustomerDto {
  @ApiProperty({ required: true, example: 'Food' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, example: 'customer@hello.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @IsUnique([Customer, 'email'])
  email: string;

  @ApiProperty({ required: true, example: '08974857674' })
  @IsNotEmpty()
  @IsString()
  phone_number: string;
}
