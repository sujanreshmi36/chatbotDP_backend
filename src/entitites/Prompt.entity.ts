import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Prompt {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    prompt:string;

    @ManyToOne(()=>User,(user)=>user.prompts)
    user:User;

}