import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { API } from 'src/entitites/API.entity';
import { User } from 'src/entitites/user.entity';

@Injectable()
export class ApiService {
  constructor(@InjectRepository(API)
  private apiRepo: Repository<API>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) { }

  async create(createApiDto: CreateApiDto, id) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } });
      const api = new API();
      api.domain = createApiDto.domain;
      api.user = user;
      return await this.apiRepo.save(api);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  // findAll() {
  //   return `This action returns all api`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} api`;
  // }

  // update(id: number, updateApiDto: UpdateApiDto) {
  //   return `This action updates a #${id} api`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} api`;
  // }
}
