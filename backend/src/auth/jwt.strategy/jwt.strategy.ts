import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Defina a interface do payload (baseado nos dados do seu token)
interface JwtPayload {
  email: string;
  sub: number; // ID do usuário
  role: 'USER' | 'ADMIN'; // Adiciona a permissão (Role)
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrai o JWT do cabeçalho Authorization como token bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      // Ignora tokens expirados (setado como false para JWT ser verificado automaticamente)
      ignoreExpiration: false, 
      // A chave secreta deve estar em um arquivo .env, não hardcoded!
      secretOrKey: 'SUA_CHAVE_SECRETA_MUITO_FORTE', // SUBSTITUIR POR process.env.JWT_SECRET
    });
  }

  // O método validate é chamado após o token ser decodificado e validado
  async validate(payload: JwtPayload) {
    // Retorna o objeto que será injetado em req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
