import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('Categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, nullable: false })
    name: string;

    @Column({ length: 100, nullable: false })
    description: string;

}