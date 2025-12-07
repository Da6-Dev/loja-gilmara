import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

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


// NOVO CAMPO: O Controller irá preencher este campo após o upload
  @IsString()
  @IsNotEmpty({ message: 'O URL da imagem é obrigatório (Erro de backend)' })
  imageUrl: string;
}
