import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateApiDto } from './create-api.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateApiDto extends PartialType(CreateApiDto) {
    @IsOptional()
    @IsString()
    @ApiProperty()
    domain: string
}
