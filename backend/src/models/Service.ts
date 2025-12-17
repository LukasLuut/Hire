import {
  Column,
  Entity,
  JoinColumn,
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
  
  @Column()
  requiresScheduling: boolean;

  @Column({ nullable: false })
  price: number;

  @Column({ length: 100, nullable: false })
  duration: string;

  @Column({ length: 200, default: "Has no subcategory" })
  subcategory?: string;

  @Column({ default: 0 })
  likesNumber?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  imageUrl?: string | null;

  @ManyToOne(() => ServiceProvider, (provider) => provider.services, {
    onDelete: "CASCADE"
  })
  @JoinColumn()
  provider: ServiceProvider;

  @OneToOne(() => Category, (category) => category.service)
  @JoinColumn()
  category: Category;

  @OneToOne(() => Hire, (hire) => hire.service)
  hire: Hire;
}
