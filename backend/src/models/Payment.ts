import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServiceProvider } from "./ServiceProvider";
import { Service } from "./Service";
import { User } from "./User";
import { Hire } from "./Hire";

@Entity("payments")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "double" })
  price: number;

  @Column({ length: 100, nullable: false })
  method: string;

  @Column({ length: 100, nullable: false })
  status: string;

  @Column({ type: "date" })
  date: Date;

  @OneToOne(() => Hire, (hire) => hire.payment, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  hire: Hire;

  @ManyToOne(() => ServiceProvider, (provider) => provider.payments)
  provider: ServiceProvider
}
