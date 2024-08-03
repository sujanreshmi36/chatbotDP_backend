import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Ip, Request } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { askQuesDTO } from './dto/askQuestion.dto';
import { RealIP } from 'nestjs-real-ip';
import { ApiTags } from '@nestjs/swagger';

@Controller('knowledge')
@ApiTags('Knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) { }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() createKnowledgeDto: CreateKnowledgeDto) {
    return this.knowledgeService.create(createKnowledgeDto);
  }


  @Post('ask-question')
  ask(@Body() askQuesDto: askQuesDTO) {
    return this.knowledgeService.ask(askQuesDto);
  }

  //get paragraph
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.knowledgeService.findOne(userId);
  }

  // @Patch(':KnowledgeId')
  // update( @Body() updateKnowledgeDto: UpdateKnowledgeDto,knowl) {
  //   return this.knowledgeService.update(updateKnowledgeDto);
  // }

  // @Delete(':userId')
  // remove(@Param('userId') userId: string) {
  //   return this.knowledgeService.remove(userId);
  // }
}


