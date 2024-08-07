import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { ApiTags } from '@nestjs/swagger';
import { CountryDTO } from './dto/get-country.dto';

@Controller('enquiry')
@ApiTags('Enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) { }

  @Post()
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiryService.create(createEnquiryDto);
  }


  @Post('create-country')
  createCoutnry(@Body() countryDto: CountryDTO) {
    return this.enquiryService.createCountry(countryDto);
  }

  @Get(':userId')
  enquiry(@Param('userId') userId: string) {
    return this.enquiryService.enquiry(userId);
  }

  @Get('get-country/:userId')
  getCountry(@Param('userId') userId: string) {
    return this.enquiryService.getCountry(userId);
  }

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.enquiryService.remove(userId);
  }

}
