import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntities } from '../../common/entity/base.entity';
import { Sale } from './sale.entity';
import { Product } from '../../product/entities/product.entity';
import { Expose } from 'class-transformer';

@Entity('sale_items')
export class SaleItem extends BaseEntities {
  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  @Expose({ name: 'sub_total' })
  subtotal: number;

  @ManyToOne(() => Sale, (sale) => sale.saleItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Product, (product) => product.saleItems, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
