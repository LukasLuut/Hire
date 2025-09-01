import { ChildEntity, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Service } from "./Service";

@ChildEntity('providerServices')
export class ProviderService extends User {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Service, (service) => service.provider)
    services: Service[]

}