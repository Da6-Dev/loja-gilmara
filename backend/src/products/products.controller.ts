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
  UploadedFiles,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly supabaseService: SupabaseService,
  ) {}

  // --- MÉTODOS PROTEGIDOS (CRIAR) ---
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5))
  async create(
    @Body() createProductDto: CreateProductDto,
    // Uso de any[] para evitar problemas de tipagem se @types/multer faltar
    @UploadedFiles() files: any[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Pelo menos uma imagem é obrigatória.');
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
      const filePath = `products/${uniqueFileName}`;

      const { error: uploadError } = await this.supabaseService
        .getClient()
        .storage.from(this.supabaseService.bucketName)
        .upload(filePath, file.buffer, {
          upsert: false,
          contentType: file.mimetype,
        });

      if (uploadError) {
        console.error('Supabase Upload Error:', uploadError);
        throw new InternalServerErrorException(
          'Erro ao fazer upload de uma das imagens.',
        );
      }

      const { data: publicUrlData } = this.supabaseService
        .getClient()
        .storage.from(this.supabaseService.bucketName)
        .getPublicUrl(filePath);

      if (publicUrlData.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }

    const productData: CreateProductDto = {
      ...createProductDto,
      price: parseFloat(String(createProductDto.price)),
      imageUrls: uploadedUrls,
    };

    return this.productsService.create(productData);
  }

  // --- MÉTODO PÚBLICO (LISTAR) ---
  // Sem @UseGuards, qualquer um pode ver os produtos
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- MÉTODOS PROTEGIDOS (ATUALIZAR) ---
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files', 5))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: any[],
  ) {
    if (files && files.length > 0) {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const uniqueFileName = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
        const filePath = `products/${uniqueFileName}`;

        const { error } = await this.supabaseService
          .getClient()
          .storage.from(this.supabaseService.bucketName)
          .upload(filePath, file.buffer, {
            upsert: false,
            contentType: file.mimetype,
          });

        if (!error) {
          const { data } = this.supabaseService
            .getClient()
            .storage.from(this.supabaseService.bucketName)
            .getPublicUrl(filePath);
          uploadedUrls.push(data.publicUrl);
        }
      }
      // Se novas imagens foram enviadas, substitui as antigas
      updateProductDto.imageUrls = uploadedUrls;
    }

    if (updateProductDto.price) {
      updateProductDto.price = parseFloat(String(updateProductDto.price));
    }

    return this.productsService.update(+id, updateProductDto);
  }

  // --- MÉTODOS PROTEGIDOS (DELETAR) ---
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
