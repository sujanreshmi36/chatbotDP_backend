import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Knowledge{
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({default:""})
    paragraph:string;

    @Column()
    category: string;

    @ManyToOne(()=>User,(user)=>user.knowledges)
    user:User
}