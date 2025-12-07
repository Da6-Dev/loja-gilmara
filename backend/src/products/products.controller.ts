import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException, 
  InternalServerErrorException,
} from '@nestjs/common';
// O import de express é mantido para compatibilidade, mas o tipo foi alterado
import * as express from 'express'; 
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly supabaseService: SupabaseService, 
  ) {}

  // Criação: Apenas ADMIN, configurado para receber UM arquivo no campo 'file'
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: any, // CORRIGIDO: Tipagem mudada para 'any' para resolver o erro TS2694
  ) {
    // 1. OBRIGATORIEDADE DA IMAGEM
    if (!file) {
      throw new BadRequestException('A imagem do produto (campo "file") é obrigatória.');
    }

    // 2. LÓGICA DE UPLOAD PARA O SUPABASE STORAGE
    const uniqueFileName = `${Date.now()}-${file.originalname.replace(/ /g, '_')}`;
    const filePath = `products/${uniqueFileName}`;

    const { error: uploadError } = await this.supabaseService.getClient().storage
      .from(this.supabaseService.bucketName)
      .upload(filePath, file.buffer, {
        upsert: false,
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      throw new InternalServerErrorException('Erro ao fazer upload da imagem para o Storage.');
    }

    // 3. OBTENÇÃO DA URL PÚBLICA
    const { data: publicUrlData } = this.supabaseService.getClient().storage
      .from(this.supabaseService.bucketName)
      .getPublicUrl(filePath);

    if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new InternalServerErrorException('URL pública não encontrada após o upload.');
    }

    const imageUrl = publicUrlData.publicUrl;

    // 4. PREPARAÇÃO FINAL DO DTO E SALVAMENTO
    const productData: CreateProductDto = {
      ...createProductDto,
      price: parseFloat(String(createProductDto.price)), 
      imageUrl,
    } as any; 

    return this.productsService.create(productData);
  }

  // Leitura: ADMIN e USER podem ver
  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Atualização: Apenas ADMIN
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // Exclusão: Apenas ADMIN
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
