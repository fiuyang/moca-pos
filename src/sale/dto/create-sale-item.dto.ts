import { IsNotEmpty, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Product } from '../../product/entities/product.entity';
import { IsExist } from '../../common/validator/exist.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleItemDto {
  @ApiProperty({ required: true, example: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f' })
  @IsNotEmpty()
  @IsExist([Product, 'id'])
  product_id: string;

  @ApiProperty({ required: true, example: 10 })
  @IsNotEmpty()
  @IsNumber()
  stock: number;

}
