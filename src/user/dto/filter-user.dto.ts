import { IsOptional, IsInt, Min, Max, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
