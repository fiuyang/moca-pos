import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Expose } from 'class-transformer';
import { SaleItem } from '../../sale/entities/sale-item.entity';

@Entity('products')
export class Product extends BaseEntities{
  @Column({ type: 'varchar', length: 150, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => SaleItem, (saleItems) => saleItems.product, {
    nullable: true,
    onDelete:"CASCADE",
    onUpdate:"CASCADE"
  })
  @Expose({ name: 'sale_items' })
  saleItems!: SaleItem[];
}
