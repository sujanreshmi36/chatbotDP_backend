import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitites/user.entity';
import { Repository } from 'typeorm';
import { Enquiry } from 'src/entitites/Enquiry.entity';
import { CountryDTO } from './dto/get-country.dto';
import { Country } from 'src/entitites/Country.entity';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Enquiry)
    private enquiryRepo: Repository<Enquiry>,

    @InjectRepository(Country)
    private countryRepo: Repository<Country>

  ) { }


  async create(createEnquiryDto: CreateEnquiryDto) {
    try {
      const { name, email, userId } = createEnquiryDto;
      const user = await this.userRepo.findOne({ where: { id: userId } })
      const enquiry = new Enquiry();
      enquiry.name = name;
      enquiry.email = email;
      enquiry.user = user;
      await this.enquiryRepo.save(enquiry);
      return {
        message: "enquiry recieved"
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  async enquiry(userId: string) {
    try {
      const User = await this.userRepo.findOne({ where: { id: userId } });
      if (!User) {
        return new NotFoundException("user not found");
      }

      const enquiries = await this.enquiryRepo.find({ where: { user: User } })

      // If no enquiries are found, return a message or throw an exception
      if (enquiries.length === 0) {
        return new NotFoundException("No enquiries found for this user");
      }
      return enquiries;
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }


  async remove(userId: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException("user not found");
      }
      const enquiries = await this.enquiryRepo.find({ where: { user: user } });

      // If no enquiries are found, return a message or throw an exception
      if (enquiries.length === 0) {
        return new NotFoundException("No enquiries found for this user");
      }
      console.log(enquiries);
      await this.enquiryRepo.remove(enquiries);
      return {
        message: "enquiries deleted successfully"
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async createCountry(countryDto: CountryDTO) {
    try {
      const userId = countryDto.userId;
      const User = await this.userRepo.findOne({ where: { id: userId } });
      if (!User) {
        throw new NotFoundException("user not found");
      }
      const country = new Country();
      country.country = countryDto.country;
      country.ip_address = countryDto.ip_address;
      country.user = User;
      country.flag=countryDto.flag;
      return await this.countryRepo.save(country);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getCountry(userId: string) {
    try {
      const User = await this.userRepo.findOne({ where: { id: userId } });
      if (!User) {
        throw new NotFoundException('user not found');
      }
      console.log(User);
      const records = await this.countryRepo.find({ where: { user: User } });

      // If no records are found, return a message or throw an exception
      if (records.length === 0) {
        return new NotFoundException("No records found for this user");
      }
      return records;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
