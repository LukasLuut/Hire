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

@Entity("hires")
export class Hire {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
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

  @ManyToOne(() => ServiceProvider, (provider) => provider.hires)
  provider: ServiceProvider;

  @OneToOne(() => Service, (service) => service.hire)
  @JoinColumn()
  service: Service;

  @OneToOne(() => Payment)
  payment: Payment;
}
