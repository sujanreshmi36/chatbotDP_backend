import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Knowledge{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({default:""})
    paragraph:string;

    @OneToOne(()=>User,(user)=>user.knowledge)
    @JoinColumn()
    user:User
}