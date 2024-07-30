import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEnquiryDto } from './create-enquiry.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEnquiryDto extends PartialType(CreateEnquiryDto) {
    @IsOptional()
    @IsString()
    @ApiProperty()
    name: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    email: string;
}
