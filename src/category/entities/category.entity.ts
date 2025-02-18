import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('categories')
export class Category extends BaseEntities{
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Product, (products) => products.category, {
    nullable: false,
  })
  products!: Product[];
}
