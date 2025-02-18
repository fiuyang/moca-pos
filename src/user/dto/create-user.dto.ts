import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { IsUnique } from '../../common/validator/unique.validator';
import { User } from '../entities/user.entity';
import { Match } from '../../common/validator/match.validator';

export class CreateUserDto {
  @ApiProperty({ required: true, example: 'cashier@moca.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsUnique([User, 'email'])
  email: string;

  @ApiProperty({ required: true, example: 'password' })
  @IsNotEmpty()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;

  @ApiProperty({ required: true, example: 'password' })
  @IsNotEmpty()
  @Match('password')
  password_confirmation: string;

  @ApiProperty({ required: true, example: 'john' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true, example: 'john doe' })
  @IsNotEmpty()
  @IsString()
  full_name: string;
}
