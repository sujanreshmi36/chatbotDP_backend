import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmpty()
  @IsString()
  @ApiProperty()
  password: string;


}
