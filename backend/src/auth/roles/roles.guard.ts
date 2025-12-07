import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core'; // Importar para ler metadados

@Injectable()
export class RolesGuard implements CanActivate {
  // O Reflector é usado para ler os metadados definidos pelo @Roles() decorator
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    // 1. Obter as roles necessárias da rota (ex: 'ADMIN', 'USER')
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(), // Verifica o método
      context.getClass(),    // Verifica o controller
    ]);

    if (!requiredRoles) {
      // Se não houver decorator @Roles() na rota, permite o acesso.
      return true;
    }

    // 2. Obter a requisição e o usuário injetado pelo JwtStrategy
    // O JwtStrategy injeta { userId, email, role } em req.user
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      // Se não houver usuário na requisição (e a rota requer roles), nega o acesso.
      return false; 
    }

    // 3. Verificar se a role do usuário está na lista de requiredRoles
    // O método 'some' verifica se pelo menos uma condição é verdadeira
    return requiredRoles.some((role) => user.role === role);
  }
}
