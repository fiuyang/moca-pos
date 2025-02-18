import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntities } from '../../common/entity/base.entity';
import { Sale } from '../../sale/entities/sale.entity';

@Entity({name: 'users'})
export class User extends BaseEntities{
  @Column({ type: 'varchar', length: 150, unique: true, nullable: true })
  email:string

  @Column({ type: 'varchar', length: 150, nullable: true })
  full_name: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  username: string

  @Column({ type: 'varchar', length: 255 })
  password: string

  @Column({ type: 'varchar', length: 50, default: 'cashier' })
  role: string;

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];
}
