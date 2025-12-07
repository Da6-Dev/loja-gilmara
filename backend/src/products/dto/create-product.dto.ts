import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  size: string;

  // ALTERADO: Validação de array de strings
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls: string[];
}
