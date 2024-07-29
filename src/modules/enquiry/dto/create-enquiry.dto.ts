import { IsEmail, IsEmpty, IsString } from "class-validator";

export class CreateEnquiryDto {
    @IsEmpty()
    @IsString()
    name:string;

    @IsEmpty()
    @IsString()
    email:string;
   
}
