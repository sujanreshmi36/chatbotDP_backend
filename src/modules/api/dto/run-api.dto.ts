import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsString } from "class-validator";

export class RunApi {
    @IsEmpty()
    @IsString()
    @ApiProperty()
    userId: string;
}