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
import { Subcategory } from "./Subcategory";
import { Availability } from "./Availability";
import { Link } from "./Link";

@Entity("service_providers")
export class ServiceProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  professionalName: string;

  @Column({ length: 100, nullable: false })
  companyName: string;

  @OneToOne(() => User, (user) => user.provider, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  user: User;
  
  @Column()
  professionalEmail: string;

  @Column() 
  professionalPhone: string;

  @Column({ default: false })
  attendsPresent: boolean

  @Column({ default: false })
  attendsOnline: boolean

  // ESSAS SÃO TESTES  
  @Column({ default: false })
  personalizedProposals: boolean

  @Column({ default: false })
  approximateLocation: boolean

  @Column({ default: false })
  publicReviews: boolean

  @Column({ default: false })
  pricesOnPage: boolean

  @Column({ default: false })
  whatsNotification: boolean

  @Column({ default: false })
  emailNotification: boolean

  @Column({ default: "available"})
  status?: string;

  @Column({ length: 400 })
  onlineLink?: string

  @Column({ length: 255, nullable: true })
  description?: string

  @Column({ length: 18, nullable: true})
  cnpj?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  profileImageUrl?: string | null;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.provider)
  subcategories: Subcategory[];

  @OneToMany(() => Link, (link) => link.provider)
  links: Link[];

  @OneToMany(() => Availability, (availability) => availability.provider)
  availabilities: Availability[];

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
