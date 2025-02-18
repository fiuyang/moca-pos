import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { CategoryResponse } from '../../category/dto/response-category.dto';

export class ProductResponse {
  @Expose()
  @ApiProperty({ example: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Mie' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'P001' })
  code: string;

  @Expose()
  @ApiProperty({ example: '4000.00' })
  price: string;

  @Expose()
  @ApiProperty({ example: 5 })
  stock: number;

  @Expose({ name: 'category' })
  @ApiProperty({
    example: {
      id: "98f80a0f-f57a-4ed3-a1af-09857453323a",
      created_at: "2025-02-18T03:22:15.090Z",
      updated_at: "2025-02-18T07:11:51.162Z",
      name: "Foods",
    }
  })
  @Transform(({ obj }) => {
    return obj.products || null;
  })
  products: CategoryResponse;

  @Expose()
  @ApiProperty({ example: '2025-02-04T06:12:02.304Z' })
  created_at: string;

  @Expose()
  @ApiProperty({ example: '2025-02-04T06:12:02.304Z' })
  updated_at: string;
}
