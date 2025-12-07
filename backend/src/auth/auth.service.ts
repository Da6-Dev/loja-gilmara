import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Role } from '../users/user.entity'; // Importamos Role também
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const userExists = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Cria a instância usando o método create do repositório
    const newUser = this.usersRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: Role.USER, // <--- MUDE DE Role.USER PARA Role.ADMIN TEMPORARIAMENTE
    });

    // Salva no banco. O método save retorna a entidade completa (User)
    const savedUser = await this.usersRepository.save(newUser);

    // Remove a senha do retorno
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = savedUser;
    return result;
  }

  async login(data: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
