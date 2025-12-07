import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SEGREDO_MUITO_FORTE_AQUI',
    });
  }

  validate(payload: any) {
    // Retorna os dados que ficarão disponíveis em req.user
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
