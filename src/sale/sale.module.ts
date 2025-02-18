import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleItem } from './entities/sale-item.entity';
import { Sale } from './entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleItem])],
  controllers: [SaleController],
  providers: [SaleService],
})
export class SaleModule {}
