import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ required: true, example: 'cashier@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ required: true, example: 'password' })
  @IsNotEmpty()
  password: string;
}

export class AccessTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjM5LCJlbWFpbCI6Im1lbWJlcjZAZ21haWwuY29tIiwiaWF0IjoxNzM4NjY4MTU3LCJleHAiOjE3Mzg2NzE3NTd9.k1abB1Dpuq3xL0nkQVhTRmogCUyJFV7x8f6GBu0O4nE',
  })
  access_token: string;
}
