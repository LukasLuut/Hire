import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('address')
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    num: number;

    @Column({ length: 100 })
    street: string;

    @Column({ length: 100 })
    neighborhood: string;

    @Column({ length: 100 })
    city: string;

    @Column({ length: 100 })
    state: string;

    @Column({ length: 100 })
    country: string;

    @Column({ length: 20 })
    postalCode: string;

    @OneToMany(() => User, (user) => user.address)
    user: User[]
}
