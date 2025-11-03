import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServiceProvider } from "./ServiceProvider";
import { Category } from "./Category";
import { Hire } from "./Hire";

@Entity("services")
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  title: string;

  @Column({ length: 250, nullable: false })
  description_service: string;
  
  @Column()
  negotiable: boolean;

  @Column({ length: 100, nullable: false})
  duration: string

  @ManyToOne(() => ServiceProvider, (provider) => provider.services)
  provider: ServiceProvider;

  @ManyToOne(() => Category, (category) => category.services)
  category: Category;

  @OneToOne(() => Hire, (hire) => hire.service)
  hire: Hire;
}
