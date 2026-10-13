import { IsString, IsUUID, IsNumber, IsOptional, IsDateString, IsArray, ValidateNested, Min, IsPositive, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class IncomingGoodItemDto {
  @ApiProperty({ example: 'ITEM001' })
  @IsString()
  @Min(1)
  @Max(50)
  itemCode: string;

  @ApiProperty({ example: 'Laptop ASUS ROG' })
  @IsString()
  @Min(1)
  @Max(200)
  itemName: string;

  @ApiProperty({ example: 15000000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 2 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Unit' })
  @IsString()
  @Min(1)
  @Max(40)
  unit: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  expiredDate?: string;
}

export class CreateIncomingGoodDto {
  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  transactionDate: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'uuid-of-sub-category' })
  @IsUUID()
  subCategoryId: string;

  @ApiProperty({ example: 'PT Supplier Jaya' })
  @IsString()
  @Min(1)
  @Max(200)
  source: string;

  @ApiPropertyOptional({ example: 'SM-001/2024' })
  @IsOptional()
  @IsString()
  @Max(100)
  letterNumber?: string;

  @ApiPropertyOptional({ example: 'attachments/file.pdf' })
  @IsOptional()
  @IsString()
  @Max(255)
  attachmentPath?: string;

  @ApiPropertyOptional({ example: 'uuid-of-operator' })
  @IsOptional()
  @IsUUID()
  operatorId?: string;

  @ApiProperty({ type: [IncomingGoodItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomingGoodItemDto)
  items: IncomingGoodItemDto[];
}

export class UpdateIncomingGoodDto {
  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-sub-category' })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiPropertyOptional({ example: 'PT Supplier Jaya' })
  @IsOptional()
  @IsString()
  @Min(1)
  @Max(200)
  source?: string;

  @ApiPropertyOptional({ example: 'SM-001/2024' })
  @IsOptional()
  @IsString()
  @Max(100)
  letterNumber?: string;

  @ApiPropertyOptional({ example: 'attachments/file.pdf' })
  @IsOptional()
  @IsString()
  @Max(255)
  attachmentPath?: string;

  @ApiPropertyOptional({ example: 'uuid-of-operator' })
  @IsOptional()
  @IsUUID()
  operatorId?: string;

  @ApiPropertyOptional({ type: [IncomingGoodItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncomingGoodItemDto)
  items?: IncomingGoodItemDto[];
}

export class IncomingGoodQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-sub-category' })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiPropertyOptional({ example: 2024 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number;

  @ApiPropertyOptional({ example: 'laptop' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['transactionDate', 'source', 'grandTotal'], example: 'transactionDate' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'transactionDate';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], example: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class ToggleVerifiedDto {
  @ApiProperty({ example: true })
  isVerified: boolean;
}