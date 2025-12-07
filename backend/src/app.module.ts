import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ProductsModule } from '../products/products.module'; // Importar ProductsModule
import { Product } from '../products/entities/product.entity'; // Importar Product Entity

@Module({
  imports: [
    // Carrega as variáveis de ambiente
    ConfigModule.forRoot(),

    // Configuração do Banco de Dados
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Product], // Adiciona Product às tabelas
      synchronize: true,
      autoLoadEntities: true,
    }),

    AuthModule,
    ProductsModule, // Adiciona ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
