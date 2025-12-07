import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module'; // << MANTER APENAS UMA VEZ AQUI

@Module({
  imports: [AuthModule, ProductsModule], // << E APENAS UMA VEZ AQUI
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
