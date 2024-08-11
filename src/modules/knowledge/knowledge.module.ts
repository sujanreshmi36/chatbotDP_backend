import { Module } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeController } from './knowledge.controller';
import { JWTStrategy } from 'src/middleware/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Knowledge } from 'src/entitites/knowledge.entity';
import { User } from 'src/entitites/user.entity';
import { ConfigService } from '@nestjs/config';
import { API } from 'src/entitites/API.entity';
import { Prompt } from 'src/entitites/Prompt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Knowledge, User, API,Prompt])],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, JWTStrategy, ConfigService],
})
export class KnowledgeModule { }
