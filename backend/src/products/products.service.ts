import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    // Injeta o repositório TypeOrm para a entidade Product
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // READ ALL
  findAll() {
    return this.productsRepository.find();
  }

  // READ ONE
  async findOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return product;
  }

  // CREATE
  create(createProductDto: CreateProductDto) {
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  // UPDATE
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id); // Reutiliza findOne para checar existência

    // O método merge combina a entidade existente com os dados de atualização
    const updatedProduct = this.productsRepository.merge(
      product,
      updateProductDto,
    );
    return this.productsRepository.save(updatedProduct);
  }

  // DELETE
  async remove(id: number) {
    const result = await this.productsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
  }
}
