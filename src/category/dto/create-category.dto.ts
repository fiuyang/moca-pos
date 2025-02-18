import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ required: true, example: 'Food' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
