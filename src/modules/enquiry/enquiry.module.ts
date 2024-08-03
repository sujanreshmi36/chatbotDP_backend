import { Module } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { EnquiryController } from './enquiry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enquiry } from 'src/entitites/Enquiry.entity';
import { User } from 'src/entitites/user.entity';
import { UsersModule } from '../users/users.module';
import { Country } from 'src/entitites/Country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enquiry, User,Country]), UsersModule],
  controllers: [EnquiryController],
  providers: [EnquiryService],
})
export class EnquiryModule { }
