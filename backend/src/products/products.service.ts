import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // CREATE
  create(createProductDto: CreateProductDto) {
    // O TypeORM cria a instância e converte os tipos se necessário
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      price: Number(createProductDto.price), // Garante que é número
    });
    return this.productsRepository.save(newProduct);
  }

  // READ ALL
  findAll() {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' }, // Ordena pelo mais recente
    });
  }

  // READ ONE
  async findOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  // UPDATE
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id); // Garante que existe

    // Mescla os dados antigos com os novos
    // Se vier preço, convertemos para número
    const dataToUpdate = { ...updateProductDto };
    if (dataToUpdate.price) {
      dataToUpdate.price = Number(dataToUpdate.price);
    }

    const updatedProduct = this.productsRepository.merge(product, dataToUpdate);
    return this.productsRepository.save(updatedProduct);
  }

  // DELETE (Corrigido para TypeORM)
  async remove(id: number) {
    // 1. Primeiro buscamos o produto para ter acesso às URLs das imagens
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    // 2. Se o produto tiver imagens, deletamos os arquivos físicos
    // (Isso só funciona se as imagens estiverem salvas localmente na pasta 'uploads')
    // Se você estiver usando Supabase Storage, a lógica seria diferente (chamando o supabaseService.remove)
    if (product.imageUrls && product.imageUrls.length > 0) {
      product.imageUrls.forEach((url) => {
        try {
          // Extrai o nome do arquivo da URL
          const fileName = url.split('/').pop();

          if (fileName) {
            // Monta o caminho: raiz_do_projeto/uploads/nome_arquivo
            const filePath = path.join(process.cwd(), 'uploads', fileName);

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Apaga o arquivo
              console.log(`Arquivo deletado: ${filePath}`);
            }
          }
        } catch (error) {
          console.error(`Erro ao tentar deletar arquivo físico: ${url}`, error);
        }
      });
    }

    // 3. Deleta o registro do banco de dados usando TypeORM
    return this.productsRepository.delete(id);
  }
}
