import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Ip, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { askQuesDTO } from './dto/askQuestion.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('knowledge')
@ApiTags('Knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) { }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('create')
  create(@Body() createKnowledgeDto: CreateKnowledgeDto, @UploadedFile() file?: Express.Multer.File) {
    return this.knowledgeService.create(createKnowledgeDto, file);
  }


  @Post('ask-question')
  ask(@Body() askQuesDto: askQuesDTO) {
    return this.knowledgeService.ask(askQuesDto);
  }

  @Get('get-sessionId')
  generate(){
    return this.knowledgeService.generate();
  }

  
  @Get('get-prompts/:userId')
  getPrompt(@Param('userId') userId: string) {
    return this.knowledgeService.getPrompt(userId);
  }


  @Get('get-history/:sessionId')
  getHistory(@Param('sessionId') sessionId: string) {
    return this.knowledgeService.getHistroy(sessionId);
  }

  //get paragraph
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.knowledgeService.findOne(userId);
  }


  @Patch('update')
  update(@Body() updateDto: UpdateKnowledgeDto) {
    return this.knowledgeService.update(updateDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId/:id')
  remove(@Param('userId') userId: string, @Param('id') id: string) {
    return this.knowledgeService.remove(userId, id);

  }
}


