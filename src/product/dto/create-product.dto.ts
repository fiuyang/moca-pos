import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { IsExist } from '../../common/validator/exist.validator';
import { Category } from '../../category/entities/category.entity';
import { IsUnique } from '../../common/validator/unique.validator';
import { Product } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ required: true, example: 'P001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  @IsUnique([Product, 'code'])
  code: string;

  @ApiProperty({ required: true, example: 'Mie' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ required: true, example: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f' })
  @IsNotEmpty()
  @IsString()
  @IsExist([Category, 'id'])
  category_id: string;

  @ApiProperty({ required: true, example: 5000 })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({ required: true, example: 10 })
  @IsInt()
  @Min(0)
  stock: number;
}
