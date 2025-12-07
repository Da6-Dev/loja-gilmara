import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'; // Importar
import { PassportModule } from '@nestjs/passport'; // Importar
import { JwtStrategy } from './jwt.strategy/jwt.strategy'; // Importar

@Module({
  imports: [
    // 1. Configurar Passport para usar 'jwt' como estratégia padrão
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // 2. Configurar JWT com sua chave secreta e tempo de expiração
    JwtModule.register({
      secret: 'SUA_CHAVE_SECRETA_MUITO_FORTE', // SUBSTITUIR POR process.env.JWT_SECRET
      signOptions: { expiresIn: '60m' }, // Token expira em 60 minutos
    }),
    // Você também pode precisar importar o PrismaClient ou módulo de usuários aqui
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Adicionar JwtStrategy aos provedores
  exports: [JwtModule, PassportModule, AuthService], // Exportar para uso em outros módulos
})
export class AuthModule {}
