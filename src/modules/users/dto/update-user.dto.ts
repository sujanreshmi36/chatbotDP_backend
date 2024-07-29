import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    name:string;
    @IsOptional()
    @IsString()
    email:string;
    @IsEmpty()
    @IsString()
    avatar:string;
}
