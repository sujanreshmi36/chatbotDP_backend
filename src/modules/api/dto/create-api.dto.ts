import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsString } from "class-validator";

export class CreateApiDto {
    @IsEmpty()
    @IsString()
    @ApiProperty()
    domain: string
}
