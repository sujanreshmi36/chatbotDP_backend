import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Prompt {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:true})
    prompt: string;

    @Column()
    response: string;

    @Column('uuid',{nullable:true})
    sessionId:string;

    @ManyToOne(() => User, (user) => user.prompts)
    user: User;

}