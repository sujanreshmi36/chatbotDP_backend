import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      // Check if an API key already exists for this user
    const existingApi = await this.apiRepo.findOne({ where: { user: user } });
    if (existingApi) {
      return {
        API_key: existingApi.key,
        message: "API key already exists for this user",
      };
    }
      const api = new API();
      api.domain = createApiDto.domain;
      api.user = user;
      const data=await this.apiRepo.save(api);
      return {
        API_key:data.key,
        message:"Api key generated"
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  // findAll() {
  //   return `This action returns all api`;
  // }

  async findOne(id: string) {
    try{
      const user=await this.userRepo.findOne({where:{id:id}});
      if(!user){
        throw new NotFoundException("user not found");
      }
      const api=await this.apiRepo.findOne({where:{user:user}});
      const key=api.key;
      if(!key){
        throw new NotFoundException("api key not found");
      }
      return{
       API_key:key
      }
    }catch(e){
      throw new BadRequestException(e.message);
    }
   
  }

  // update(id: number, updateApiDto: UpdateApiDto) {
  //   return `This action updates a #${id} api`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} api`;
  // }
}
