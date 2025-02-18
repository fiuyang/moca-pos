import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class CustomerResponse {
  @Expose()
  @ApiProperty({ example: 'f23e257a-a6e1-4fea-9daf-5fb21bdd0d0f' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: '0897465635243' })
  phone_number: string;

  @Expose()
  @ApiProperty({ example: 'John@moca.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: '2025-02-04T06:12:02.304Z' })
  created_at: string;

  @Expose()
  @ApiProperty({ example: '2025-02-04T06:12:02.304Z' })
  updated_at: string;
}
