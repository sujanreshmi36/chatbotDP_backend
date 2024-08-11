import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty } from "class-validator";

export class getVerifyDTO {
    @IsEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
}