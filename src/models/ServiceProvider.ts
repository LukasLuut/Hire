import { ChildEntity, Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Service } from "./Service";
import { Category } from "./Category";

@Entity('service_provider')
export class ServiceProvider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    companyName: string;

    @OneToOne(() => User, { cascade: true })
    user: User;

    @OneToMany(() => Category, (category) => category.provider)
    categories: Category[]

    @OneToMany(() => Service, (service) => service.provider)
    services: Service[]

}