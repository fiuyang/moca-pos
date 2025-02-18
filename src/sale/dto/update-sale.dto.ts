import { PartialType } from '@nestjs/swagger';
import { CreateSaleDto } from './create-sale.dto';
import { IsOptional } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsOptional()
  id?: string;
}
