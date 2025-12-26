import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ServiceProvider } from "./ServiceProvider";

@Entity("availabilities")
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  day: string;

  @Column({ length: 10, nullable: false })
  start: string;
  
  @Column({ length: 10, nullable: false })
  end: string;

  @ManyToOne(() => ServiceProvider, (provider) => provider.availabilities, {
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  provider: ServiceProvider;
  
}
