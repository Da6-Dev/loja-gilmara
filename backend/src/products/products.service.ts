// Exemplo de ProductsService
import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaClient } from '../generated/prisma'; // Importe o Prisma Client

@Injectable()
export class ProductsService {
  private prisma = new PrismaClient(); // Em um projeto real, use um PrismaService injetável

  // READ ALL
  findAll() {
    return this.prisma.product.findMany();
  }

  // READ ONE
  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  // CREATE
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  // UPDATE
  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // DELETE
  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
