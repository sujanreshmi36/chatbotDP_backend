import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { ApiTags } from '@nestjs/swagger';
import { CountryDTO } from './dto/get-country.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('enquiry')
@ApiTags('Enquiry')
export class EnquiryController {
  constructor(private readonly enquiryService: EnquiryService) { }

  @Post()
  create(@Body() createEnquiryDto: CreateEnquiryDto) {
    return this.enquiryService.create(createEnquiryDto);
  }


  @Post('create-country')
  @UseInterceptors(FileInterceptor('flag', {
    storage: diskStorage({
      destination: "./flags",
      filename: (req, file, cb) => {
        const uniqueSuffix = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, `${file.originalname}-${uniqueSuffix}${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`);
      }
    })
  }))
  createCountry(@Body() countryDto: CountryDTO) {
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
