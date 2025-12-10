import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServiceProvider } from "./ServiceProvider";
import { Service } from "./Service";
import { User } from "./User";
import { Payment } from "./Payment";
import { Contract } from "./Contract";

export enum StatusEnum {
  PENDENTE = "PENDENTE",
  EM_ANDAMENTO = "EM ANDAMENTO",
  CONCLUIDO = "CONCLUIDO",
  CANCELADO = "CANCELADO"
}

@Entity("hires")
export class Hire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date"})
  firstContact: Date;

  @Column({ type: "double" })
  price: number;

  @Column({ length: 100, nullable: false })
  description_service: string;

  // Contrato
  @OneToMany(() => Contract, (contract) => contract.hire)
  contracts: Contract[];

  // Cliente
  @ManyToOne(() => User, (user) => user.hires)
  user: User;

  @Column({
    type: "enum",
    enum: StatusEnum,
    default: StatusEnum.PENDENTE,
  })
  status: StatusEnum;

  @ManyToOne(() => ServiceProvider, (provider) => provider.hires)
  provider: ServiceProvider;

  @OneToOne(() => Service, (service) => service.hire)
  @JoinColumn()
  service: Service;

  @OneToOne(() => Payment)
  payment: Payment;
}
