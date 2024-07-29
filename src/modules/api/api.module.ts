import { Module } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiController } from './api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { API } from 'src/entitites/API.entity';
import { UsersModule } from '../users/users.module';
import { User } from 'src/entitites/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([API, User]), UsersModule],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule { }
