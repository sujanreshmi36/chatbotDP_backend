import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Entity()
export class API {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column({ unique: true })
  key: string;

  @Column({ default: '' })
  domain: string;

  @Column({default:false})
  status:boolean;
  
  @BeforeInsert()
  generateKey() {
    const uuidWithoutHyphens = uuidv4().replace(/-/g, '');
    const date = Date.now().toString();
    this.key = `${uuidWithoutHyphens}${date}`;
  }
  @OneToOne(()=>User,(user)=>user.api)
  @JoinColumn()
  user:User  
}
