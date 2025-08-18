import { Column, PrimaryGeneratedColumn } from "typeorm";


export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date"})
    firstContact: Date;

    @Column({ type: "double"})
    price: number;

    @Column({ length: 100, nullable: false})
    description_service: string;
}