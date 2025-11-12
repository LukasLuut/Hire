// Importa os decorators e funções do TypeORM para criar a entidade e mapear colunas e relacionamentos
// Decorators são uma funcionalidade do TypeScript (e do JavaScript moderno) que permitem adicionar comportamento extra a classes, métodos ou propriedades de forma declarativa, usando o símbolo @. É por causa deles que conseguimos 'transformar' as classes e as propriedades dela em tabelas e colunas no nosso banco de dados. Cada decorator, cada @, diz ao ORM o que aquela classe ou propriedade representa.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import { Address } from "./Address";
import bcrypt from "bcrypt";
import { ServiceProvider } from "./ServiceProvider";
import { Contract } from "./Contract";
import { Hire } from "./Hire";

// @Entity('users') indica que esta classe representa a tabela "users" no banco
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  @Column({ length: 14, nullable: false })
  cpf_cnpj: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'boolean' })
  acceptedTerms: boolean;

  @Column({ type: 'date', nullable: true})
  acceptedAt: Date;

  @OneToOne(() => Address, (address) => address.user, { cascade: true })
  @JoinColumn()
  address: Address;

  @OneToOne(() => ServiceProvider, (provider) => provider.user)
  provider: ServiceProvider;

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts: Contract[];

  @OneToMany(() => Hire, (hire) => hire.user)
  hires: Hire[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password.startsWith("$2")) {
      const rounds = Number(process.env.BCRYPT_SALT_ROUNDS);

      this.password = await bcrypt.hash(this.password, rounds);
    }
  }

  async validatePassword(plain: string): Promise<boolean> {
    return await bcrypt.compare(plain, this.password);
  }
}
