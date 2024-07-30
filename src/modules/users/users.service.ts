import { BadRequestException, ForbiddenException, Get, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entitites/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private config: ConfigService) { }


  async update(filename: string, id: string) {
    try {
      console.log(id);
      if (!filename) {
        throw new BadRequestException("Files are required.");
      }
      const baseURL = this.config.get<string>('baseURL');
      const user = await this.usersRepository.findOne({ where: { id: id } });
      user.avatar = `${baseURL}/${filename}`;
      return this.usersRepository.save(user);

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }


  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    } else {
      return user;
    }

  }

  // async update(id: string, updateUserDto: UpdateUserDto) {
  //   const user = await this.usersRepository.findOneBy({ id });
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   return await this.usersRepository.update(id, updateUserDto);

  // }

  async remove(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException();
      } else {
        return await this.usersRepository.remove(user);
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }
}
