import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Ip, Request } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { askQuesDTO } from './dto/askQuestion.dto';
import { RealIP } from 'nestjs-real-ip';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

@UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createKnowledgeDto: CreateKnowledgeDto) {
    return this.knowledgeService.create(createKnowledgeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('ask-question')
  ask(@Body() askQuesDto:askQuesDTO){
    return this.knowledgeService.ask(askQuesDto);
  }
  

  @Delete(':userId')
  remove(@Param('userId') userId: string) {
    return this.knowledgeService.remove(userId);
  }
}


  // @Get(':id')
  // findOne(@Param('id') id: number) {
  //   return this.knowledgeService.findOne(id);
  // }

  // @Patch(':userId')
  // update( @Body() updateKnowledgeDto: UpdateKnowledgeDto) {
  //   return this.knowledgeService.update(updateKnowledgeDto);
  // }
