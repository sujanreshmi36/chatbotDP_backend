import { ApiBody, ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsEmpty()
  @IsString()
  @ApiProperty()
  name: string;
  password: string;
 
  @ApiProperty()
  @IsOptional()
  @IsString()
  role: string;
}
