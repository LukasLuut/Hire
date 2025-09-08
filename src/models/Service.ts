import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ServiceProvider } from "./ServiceProvider";
import { Category } from "./Category";

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date" })
    firstContact: Date;

    @Column({ type: "double" })
    price: number;

    @Column({ length: 100, nullable: false })
    description_service: string;

    @ManyToOne(() => ServiceProvider, (provider) => provider.services)
    provider: ServiceProvider
    
    @ManyToOne(() => Category, (category) => category.services)
    category: Category   

}