import { Module } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeController } from './knowledge.controller';
import { JWTStrategy } from 'src/middleware/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Knowledge } from 'src/entitites/knowledge.entity';
import { User } from 'src/entitites/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Knowledge, User])],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, JWTStrategy, ConfigService],
})
export class KnowledgeModule { }
