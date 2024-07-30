import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Knowledge } from 'src/entitites/knowledge.entity';
import { User } from 'src/entitites/user.entity';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { askQuesDTO } from './dto/askQuestion.dto';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private knowledgeRepo: Repository<Knowledge>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    private config: ConfigService

  ) { }

  async create(createKnowledgeDto: CreateKnowledgeDto) {
    try {
      const isUser = await this.userRepo.findOne({ where: { id: createKnowledgeDto.userId } })
      if (!isUser) {
        throw new ForbiddenException("Invalid userId")
      }
      // Check if the user already has a Knowledge entry
      const isExistingKnowledge = await this.knowledgeRepo.findOne({ where: { user: isUser } });

      if (isExistingKnowledge) {
        isExistingKnowledge.paragraph = createKnowledgeDto.paragraph;
        return await this.knowledgeRepo.save(isExistingKnowledge);
      }

      //creating knowledge
      const knowledgeModel = new Knowledge()
      knowledgeModel.paragraph = createKnowledgeDto.paragraph;
      knowledgeModel.user = isUser;
      return await this.knowledgeRepo.save(knowledgeModel);
    } catch (e) {

      throw new BadRequestException(e.message);
    }

  }


  async ask(askQuesDto: askQuesDTO) {

    try {
      console.log(askQuesDto);
      const { userId, prompt } = askQuesDto
      const isuser = await this.userRepo.findOne({ where: { id: userId } });
      if (!isuser) {
        throw new NotFoundException("User doesnot exist");
      }
      const api_key = this.config.get<string>('API_KEY');
      if (!api_key) {
        throw new BadRequestException('API key is missing');
      }
      const genAI = new GoogleGenerativeAI(api_key);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const knowledge = await this.knowledgeRepo.findOne({ where: { user: isuser } });
      const paragraph = knowledge.paragraph;
      if (!prompt) {
        return {
          message: "Please Enter prompt"
        };
      }
      const question = `forget my all prompt. I will give you some paragraphs of content. you just have a look and i will ask you question related to them later which you need to answer me. remember just give answer in full sentence tag according to question based on the paragraph. if answer is not found there in paragraph just say some invalid response. paragraph goes like this remember it: ${paragraph} and question is ${prompt}`;
      const result = await model.generateContent(question);
      const response = await result.response;
      if (response) {
        const text = response.text();
        const formattedText = text.replace(/\n/g, '<br>'); // Replace newline characters with <br> tags for HTML formatting
        return {
          answer: formattedText
        };
      } else {
        return {
          message: "can't get the answer."
        }
      }

    } catch (e) {
      throw e
    }


  }

  //get paragraph
  async findOne(uid: string) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: uid
        }
      })
      const knowledge = await this.knowledgeRepo.findOne({ where: { user } });
      const { paragraph, id } = knowledge;
      return {
        KnowledgeId: id,
        paragraph: paragraph
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }


  // async remove(userId: string) {
  //   const isuser = await this.userRepo.findOne({ where: { id: userId } });
  //   if (!isuser) {
  //     throw new ForbiddenException("Invalid user")
  //   }
  //   const knowledge = await this.knowledgeRepo.findOne({
  //     where: {
  //       user: isuser
  //     }
  //   })
  //   await this.knowledgeRepo.remove(knowledge);
  //   return {
  //     message: "Knowledge deleted"
  //   }
  // }
}
