import { IsEmail, IsEmpty } from "class-validator";

export class getVerifyDTO{
    @IsEmpty()
    @IsEmail()
    email:string;
}