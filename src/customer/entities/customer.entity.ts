import { BaseEntities } from '../../common/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Sale } from '../../sale/entities/sale.entity';

@Entity('customers')
export class Customer extends BaseEntities{
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  email: string;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales: Sale[];
}
