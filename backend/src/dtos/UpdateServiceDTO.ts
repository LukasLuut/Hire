import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateServiceDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description_service?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  negotiable?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  requiresScheduling?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  subcategory?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  likesNumber?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
