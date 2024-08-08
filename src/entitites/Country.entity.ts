import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Country{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    country:string;

    @Column({default:''})
    ip_address:string;

    @Column()
    flag:string;

    @ManyToOne(()=>User,(user)=>user.countries)
    user:User;
}