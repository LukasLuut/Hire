import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Service } from "./Service";
import { Category } from "./Category";
import { Contract } from "./Contract";
import { Hire } from "./Hire";
import { Payment } from "./Payment";

@Entity("service_providers")
export class ServiceProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  companyName: string;

  @OneToOne(() => User, (user) => user.provider, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => Contract, (contract) => contract.provider)
  contracts: Contract[];

  @OneToMany(() => Category, (category) => category.provider)
  categories: Category[];

  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];

  @OneToMany(() => Hire, (hire) => hire.provider)
  hires: Hire[];

  @OneToMany(() => Payment, (payment) => payment.provider)
  payments: Payment[];
}
