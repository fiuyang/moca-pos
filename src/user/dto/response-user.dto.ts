import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class UserResponse {
  @Exclude()
  password: string;

  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'cashier@moca.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  full_name: string;

  @Expose()
  @ApiProperty({ example: 'John' })
  username: string;

  @Expose()
  @ApiProperty({ example: 'cashier' })
  role: string;

  @Expose()
  @ApiProperty({})
  created_at: string;

  @Expose()
  @ApiProperty({})
  updated_at: string;
}
