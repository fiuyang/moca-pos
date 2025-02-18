import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { User } from '../../user/entities/user.entity';
import { Expose, Type } from 'class-transformer';
import { SaleItem } from './sale-item.entity';

@Entity('sales')
export class Sale extends BaseEntities{
  @Column({ type: 'varchar', unique: true })
  code: string;

  @Column({ type: 'date' })
  purchase_date: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  total_amount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  @Type(() => Number)
  change: number;

  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  @ManyToOne(() => Customer, (customer) => customer.sales)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SaleItem, (saleItems) => saleItems.sale, {
    nullable: false,
    onDelete:"CASCADE",
    onUpdate:"CASCADE",
    eager: true
  })
  saleItems: SaleItem[];
}
