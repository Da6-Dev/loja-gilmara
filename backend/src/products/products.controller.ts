import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { RolesGuard } from '../auth/roles/roles.guard'; //
import { Roles } from '../auth/roles/roles.decorator'; //

// Protege todas as rotas deste controller com o JWT Guard (que você deve implementar)
// e o RolesGuard para restringir o acesso apenas a administradores.
@UseGuards(/* AuthGuard('jwt') ,*/ RolesGuard)
@Roles('ADMIN') // O enum Role no Prisma tem o valor ADMIN
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  // Permite que usuários "USER" também vejam a lista de produtos, se desejar
  // @Roles('ADMIN', 'USER')
  findAll() {
    return this.productsService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
