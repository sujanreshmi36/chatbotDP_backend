import { IsString, IsUUID } from "class-validator";

export class CreateKnowledgeDto {
    @IsUUID()
    userId:string;
    @IsString()
    paragraph:string;
}
