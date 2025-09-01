import { Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProviderService } from "./ProviderService";
import { Category } from "./Category";


export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date" })
    firstContact: Date;

    @Column({ type: "double" })
    price: number;

    @Column({ length: 100, nullable: false })
    description_service: string;

    @ManyToOne(() => ProviderService, (provider) => provider.services)
    provider: ProviderService
    
    @ManyToOne(() => Category, (category) => category.services)
    category: Category   
}