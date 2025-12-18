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

@Entity("links")
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  name: string;

  @ManyToOne(() => ServiceProvider, (provider) => provider.links, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  provider: ServiceProvider;
  
}
