import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class CreateKnowledgeDto {
    @IsUUID()
    @ApiProperty()
    userId: string;

    @IsString()
    @ApiProperty()
    paragraph: string;
}
