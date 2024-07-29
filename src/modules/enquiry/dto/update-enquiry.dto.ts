import { PartialType } from '@nestjs/swagger';
import { CreateEnquiryDto } from './create-enquiry.dto';

export class UpdateEnquiryDto extends PartialType(CreateEnquiryDto) {}
