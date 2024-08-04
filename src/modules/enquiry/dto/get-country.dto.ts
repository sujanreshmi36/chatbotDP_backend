import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsString } from "class-validator";

export class CountryDTO {
    @IsEmpty()
    @IsString()
    @ApiProperty()
    country: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    userId: string;

    @IsEmpty()
    @IsString()
    @ApiProperty()
    flag:string;
}