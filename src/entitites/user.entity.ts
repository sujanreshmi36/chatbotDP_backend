import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Knowledge } from "./knowledge.entity";
import { Enquiry } from "./Enquiry.entity";
import { API } from "./API.entity";
import { Country } from "./Country.entity";

@Entity()
export class User {
 
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column({ default: "" })
  avatar: string;

  @OneToOne(() => Knowledge, (knowledge) => knowledge.user)
  knowledge: Knowledge;

  @OneToOne(() => API, (api) => api.user)
  api: API;

  @OneToMany(() => Enquiry, (enquiry) => enquiry.user)
  enquiries: Enquiry[];

  @OneToMany(() => Country, (country) => country.user)
  countries: Country[];

}
