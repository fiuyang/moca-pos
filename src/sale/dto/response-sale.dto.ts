import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { CustomerResponse } from '../../customer/dto/response-customer.dto';
import { SaleItemResponse } from './response-sale-item.dto';
import { UserResponse } from '../../user/dto/response-user.dto';

export class SaleResponse {
  @Expose()
  @ApiProperty({ example: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f' })
  id: string;

  @Expose()
  @ApiProperty({ example: '20250218000001' })
  code: string;

  @Expose()
  @ApiProperty({ example: '13000.00' })
  total_amount: string;

  @Expose()
  @ApiProperty({ example: '2025-02-18' })
  purchase_date: string;

  @Expose()
  @ApiProperty({ example: '2000.00' })
  change: string;

  @Expose()
  @ApiProperty({ example: 'cash' })
  payment_method: string;

  @Expose({ name: 'customer' })
  @ApiProperty({
    example: {
      id: "98f80a0f-f57a-4ed3-a1af-09857453323a",
      created_at: "2025-02-18T03:22:15.090Z",
      updated_at: "2025-02-18T07:11:51.162Z",
      name: "Food",
      phone_number: "08974857674",
      email: "customer@hello.com"
    }
  })
  @Transform(({ obj }) => {
    return obj.customer || null;
  })
  customer: CustomerResponse;

  @Expose({ name: 'user' })
  @ApiProperty({
    example: {
      id: "c58f2002-3fcb-478d-bacc-e7b64ac3389c",
      created_at: "2025-02-18T06:29:12.613Z",
      updated_at: "2025-02-18T06:29:12.613Z",
      email: "cashier@moca.com",
      full_name: "john doe",
      username: "john",
      role: "cashier"
    }
  })
  @Transform(({ obj }) => {
    return obj.user || null;
  })
  user: UserResponse;

  @Expose({ name: 'sale_items' })
  @ApiProperty({
    example: [
      {
        id: "b56c053e-818d-43ac-8c6d-228ed8f9e13a",
        created_at: "2025-02-18T07:03:21.495Z",
        updated_at: "2025-02-18T07:03:21.495Z",
        quantity: 1,
        price: "5000.00",
        subtotal: "5000.00",
        product: {
          id: "4338fee2-3e86-4b89-b6a0-edd0b1a4c277",
          created_at: "2025-02-18T03:26:21.996Z",
          updated_at: "2025-02-18T07:11:51.162Z",
          code: "P002",
          name: "Mie",
          price: "5000.00",
          stock: 7
        }
      },
    ],
    isArray: true,
  })
  @Transform(({ obj }) => {
    return obj.saleItems || null;
  })
  sale_items: SaleItemResponse[];

  @Expose()
  @ApiProperty({ example: '2025-02-04T06:12:02.304Z' })
  created_at: string;

  @Expose()
  @ApiProperty({ example: '2025-02-04T06:12:02.304Z' })
  updated_at: string;
}
