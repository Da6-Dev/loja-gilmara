import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  public bucketName: string;

  constructor(private configService: ConfigService) {
    // CORREÇÃO: Usamos o operador '!' para afirmar ao TS que o valor será string
    // e confiamos na nossa verificação abaixo.
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL')!;
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY')!;
    this.bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME')!;

    // A verificação defensiva garante que a aplicação falhe se as variáveis estiverem faltando
    if (!supabaseUrl || !supabaseKey || !this.bucketName) {
      throw new InternalServerErrorException('Variáveis de ambiente do Supabase (URL, KEY ou BUCKET_NAME) não estão configuradas.');
    }

    // Inicializa o cliente Supabase
    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, 
      },
    });
  }

  // Getter para o cliente Supabase
  getClient(): SupabaseClient {
    return this.supabase;
  }
}
