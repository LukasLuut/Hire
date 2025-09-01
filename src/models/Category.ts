import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Service } from "./Service";

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column({ length: 100, nullable: false })
    description: string;

    @OneToMany(() => Service, (service) => service.category)
    services: Service[]
}