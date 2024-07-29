import { IsEmpty, IsString } from "class-validator";

export class CreateApiDto {
    @IsEmpty()
    @IsString()
    domain: string
}
