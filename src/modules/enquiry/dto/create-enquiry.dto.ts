import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsString } from "class-validator";

export class CreateEnquiryDto {
    @IsEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    email: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    userId: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    month: string;

}
