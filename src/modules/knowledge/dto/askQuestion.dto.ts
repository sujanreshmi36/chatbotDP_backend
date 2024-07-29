import { IsEmpty, IsString, IsUUID } from "class-validator";

export class askQuesDTO{
@IsUUID()
userId:string;

@IsEmpty()
@IsString()
prompt:string;
}