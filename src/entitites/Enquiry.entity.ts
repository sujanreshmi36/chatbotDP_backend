import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Enquiry {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.enquiries)
  @JoinColumn()
  user: User;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  month: string;

}