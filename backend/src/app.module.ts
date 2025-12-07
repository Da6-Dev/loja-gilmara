import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { SupabaseModule } from './supabase/supabase.module'; // Importa o novo módulo Supabase

@Module({
  imports: [
    // CORREÇÃO 1: Adiciona isGlobal: true para que ConfigService funcione em qualquer lugar
    ConfigModule.forRoot({
        isGlobal: true, 
    }),

    // Configuração do Banco de Dados
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, Product],
      synchronize: true,
      autoLoadEntities: true,
    }),

    // CORREÇÃO 2: Adiciona o módulo Supabase
    SupabaseModule,
    
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
