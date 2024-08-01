import { IsEmpty, IsString } from "class-validator";

export class getInfoDTO{
    @IsEmpty()
    @IsString()
    api_key:string;
}