import { PartialType } from '@nestjs/mapped-types';
import { CreateKnowledgeDto } from './create-knowledge.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateKnowledgeDto extends PartialType(CreateKnowledgeDto) {
    @IsUUID()
    @IsOptional()
    userID:string;

    @IsString()
    @IsOptional()
    paragraph:string;
}

