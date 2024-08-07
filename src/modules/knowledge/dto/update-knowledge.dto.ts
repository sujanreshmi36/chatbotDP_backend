import { PartialType } from '@nestjs/mapped-types';
import { CreateKnowledgeDto } from './create-knowledge.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateKnowledgeDto extends PartialType(CreateKnowledgeDto) {
    @IsUUID()
    @ApiProperty()
    userId: string;

    @IsUUID()
    @ApiProperty()
    id: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    paragraph: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    category: string;
}

