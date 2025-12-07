import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Global() // Torna o serviço disponível para todos os outros módulos
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService], // Exporta o serviço para que o ProductsModule possa usá-lo
})
export class SupabaseModule {}
