import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsString, IsUUID } from "class-validator";

export class askQuesDTO {
    @IsUUID()
    @ApiProperty()
    userId: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    prompt: string;
    
    @IsEmpty()
    @IsString()
    @ApiProperty()
    sessionId: string;
    

}