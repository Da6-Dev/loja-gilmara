import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  // Assumindo que size é uma string (ex: 'P', 'M', 'G', 'GG')
  @Column({ length: 10 })
  size: string;

  // NOVO CAMPO: URL da Imagem (não pode ser nulo se for obrigatório na criação)
  @Column({ nullable: true}) 
  imageUrl: string; 
  // Removida a duplicação do imageUrl daqui

  @CreateDateColumn()
  createdAt: Date; // Primeira declaração

  @UpdateDateColumn()
  updatedAt: Date; // Primeira declaração
}
// Removidas as declarações duplicadas de createdAt e updatedAt que causavam o erro TS2300
