import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { API } from 'src/entitites/API.entity';
import { User } from 'src/entitites/user.entity';
import { RunApi } from './dto/run-api.dto';
import { getInfoDTO } from './dto/get-info.dto';
import { notContains } from 'class-validator';

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
          domain: existingApi.domain,
          chatbot_name: existingApi.chatbot_name,
          status: existingApi.status,
          message: "API key already exists for this user",
        };
      }

      // Validate that the domain field is not empty
      if (!createApiDto.domain || createApiDto.domain.trim() === '') {
        throw new BadRequestException('Domain cannot be empty');
      }
      const api = new API();
      api.domain = createApiDto.domain;
      api.user = user;
      api.chatbot_name = createApiDto.chatbot_name;
      const data = await this.apiRepo.save(api);
      return {
        API_key: data.key,
        status: data.status,
        chatbot_name: data.chatbot_name,
        message: "Api key generated"
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }



  async findOne(id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException("user not found");
      }
      const api = await this.apiRepo.findOne({ where: { user: user } });
      const key = api.key;
      if (!key) {
        throw new NotFoundException("api key not found");
      }
      return {
        API_key: key,
        chatbot_name: api.chatbot_name,
        domain: api.domain,
        status: api.status
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  async run(runApi: RunApi) {
    try {
      const id = runApi.userId;
      const user = await this.userRepo.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException("user not found");
      }
      const api = await this.apiRepo.findOne({ where: { user: user } });
      api.status = true;
      await this.apiRepo.save(api);
      return {
        status: api.status,
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getInfo(getInfoDto: getInfoDTO) {
    try {
      const key = getInfoDto.api_key;
      const api = await this.apiRepo.findOne({ where: { key: key } });
      if (!api) {
        return new NotFoundException("api not found");
      }
      const user = await this.userRepo.findOne({ where: { api: api } })
      const avatar = user.avatar;
      const userId = user.id;
      const domain = api.domain;
      const chatbot_name = api.chatbot_name;
      const status = api.status;
      return {
        userId: userId,
        avatar: avatar,
        domain: domain,
        chatbot_name: chatbot_name,
        status: status
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }


  async change( userId:string,updateapi:UpdateApiDto) {
    try {
     const isuser=await this.userRepo.findOne({where:{id:userId}});
     if(!isuser){
      throw new NotFoundException("user not found");
     }
     const isapi=await this.apiRepo.findOne({where:{user:isuser}});
     isapi.chatbot_name=updateapi.chatbot_name;
     isapi.domain=updateapi.domain;
     return this.apiRepo.save(isapi);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

}
