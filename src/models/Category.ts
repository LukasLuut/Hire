import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./Service";
import { ServiceProvider } from "./ServiceProvider";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column({ length: 100, nullable: false })
    description: string;

    @ManyToOne(() => ServiceProvider, (provider) => provider.categories)
    provider: ServiceProvider

    @OneToMany(() => Service, (service) => service.category)
    services: Service[]

    
}