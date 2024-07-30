import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entitites/user.entity';
import { Repository } from 'typeorm';
import { Enquiry } from 'src/entitites/Enquiry.entity';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Enquiry)
    private enquiryRepo: Repository<Enquiry>) { }


  async create(createEnquiryDto: CreateEnquiryDto) {
    try {
      const { name, email } = createEnquiryDto;
      const user = await this.userRepo.findOne({ where: { email: email } })
      const enquiry = new Enquiry();
      enquiry.name = name;
      enquiry.email = email;
      enquiry.user = user;
      return await this.enquiryRepo.save(enquiry);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  // findAll() {
  //   return `This action returns all enquiry`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} enquiry`;
  // }

  // update(id: number, updateEnquiryDto: UpdateEnquiryDto) {
  //   return `This action updates a #${id} enquiry`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} enquiry`;
  // }
}
