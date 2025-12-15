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

@Entity("subcategories")
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @ManyToOne(() => ServiceProvider, (provider) => provider.subcategories, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  provider: ServiceProvider;
  
}
