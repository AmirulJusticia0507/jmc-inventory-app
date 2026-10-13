import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'CAT001', maxLength: 10 })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  code: string;

  @ApiProperty({ example: 'Elektronik' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'CAT002', maxLength: 10 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  code?: string;

  @ApiPropertyOptional({ example: 'Elektronik Updated' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;
}