import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString()
    @ApiProperty()
    name:string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    email:string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    avatar:string;
}
