import { IsEmpty, IsString } from "class-validator";

export class getInfoDTO{

    @IsString()
    api_key:string;

    @IsString()
    chatbot_name:string;
}