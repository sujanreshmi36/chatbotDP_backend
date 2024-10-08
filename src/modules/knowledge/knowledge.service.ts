import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateKnowledgeDto } from './dto/create-knowledge.dto';
import { UpdateKnowledgeDto } from './dto/update-knowledge.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Knowledge } from 'src/entitites/knowledge.entity';
import { User } from 'src/entitites/user.entity';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { askQuesDTO } from './dto/askQuestion.dto';
import { API } from 'src/entitites/API.entity';
import { Prompt } from 'src/entitites/Prompt.entity';
import * as pdfParse from 'pdf-parse';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(Knowledge)
    private knowledgeRepo: Repository<Knowledge>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(API)
    private apiRepo: Repository<API>,

    @InjectRepository(Prompt)
    private promptRepo: Repository<Prompt>,

    private config: ConfigService,
  ) {}

  async create(
    createKnowledgeDto: CreateKnowledgeDto,
    pdfFile?: Express.Multer.File,
  ) {
    try {
      const isUser = await this.userRepo.findOne({
        where: { id: createKnowledgeDto.userId },
      });
      if (!isUser) {
        throw new ForbiddenException('Invalid userId');
      }
      //creating knowledge
      const knowledgeModel = new Knowledge();
      if (pdfFile) {
        const pdfContent = await pdfParse.default(pdfFile.buffer);
        if (!pdfContent.metadata) {
          throw new BadRequestException('Invalid data form');
        }
        const maxLength = 5000;
        if (pdfContent.text.length > maxLength) {
          throw new BadRequestException(
            `The PDF content is too long. Maximum allowed length is ${maxLength} characters.`,
          );
        }
        knowledgeModel.paragraph = pdfContent.text.replace(/\s+/g, ' ').trim();
      } else if (createKnowledgeDto.paragraph) {
        knowledgeModel.paragraph = createKnowledgeDto.paragraph;
      } else {
        throw new BadRequestException('No paragraph or PDF file provided');
      }
      knowledgeModel.user = isUser;
      knowledgeModel.category = createKnowledgeDto.category;
      return await this.knowledgeRepo.save(knowledgeModel);
    } catch (e) {
      if (e instanceof ForbiddenException || e instanceof BadRequestException) {
        throw e;
      }
      throw new BadRequestException('Invalid file format');
    }
  }

  async ask(askQuesDto: askQuesDTO) {
    try {
      const { userId, prompt, sessionId } = askQuesDto;
      const isuser = await this.userRepo.findOne({ where: { id: userId } });
      if (!isuser) {
        throw new NotFoundException('User doesnot exist');
      }
      //  const isApi=await this.apiRepo.findOne({where:{user:isuser}});
      //  if(!isApi.status){
      //   return new BadRequestException("Api key is not activated.");
      //  }

      const api_key = this.config.get<string>('API_KEY');
      if (!api_key) {
        throw new BadRequestException('API key is missing');
      }
      const genAI = new GoogleGenerativeAI(api_key);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const knowledge = await this.knowledgeRepo.find({
        where: { user: isuser },
      });
      const paragraph = knowledge.map((knowledge) => knowledge.paragraph);
      if (!prompt) {
        return {
          message: 'Please Enter prompt',
        };
      }
      // const question = `forget my all prompt. I will give you some paragraphs of content . you just have a look and i will ask you question related to them later which you need to answer me. remember just give answer in full sentence such that you like assistant according to question based on the paragraph. if answer is not found there in paragraph just say some invalid response. paragraph goes like this remember it: ${paragraph} and question is ${prompt}`;
      const question = `suppose you are assistant of a company and I will give paragraph about that company, user will ask the question and you have to answer them carefully without html tags on the basis of paragraph in natural and short like an assistant and if there is question that is out of paragraph then simply answer 'I can't respond to this quesiton' and if there are points then simply give answer in points, the paragraph goes like this: ${paragraph} and question goes like this: ${prompt}`;
      const result = await model.generateContent(question);
      const response = await result.response;
      if (response) {
        const savePrompt = new Prompt();
        savePrompt.prompt = prompt;
        savePrompt.sessionId = sessionId;
        savePrompt.user = isuser;
        savePrompt.response = response.text();
        await this.promptRepo.save(savePrompt);
        return {
          answer: response.text(),
        };
      }
    } catch (e) {
      // return {
      //   answer: "I can't respond to this message."
      // }
      throw new BadRequestException(e.message);
    }
  }

  //get-prompts
  async getPrompt(userid: string) {
    try {
      const isUser = await this.userRepo.findOne({ where: { id: userid } });
      if (!isUser) {
        throw new NotFoundException('user not found.');
      }
      const isPrompt = await this.promptRepo.find({ where: { user: isUser } });
      if (!isPrompt) {
        return;
      }
      const prompts = isPrompt.map((isPrompt) => isPrompt.prompt);
      const id = isPrompt.map((isPrompt) => isPrompt.id);
      const response = isPrompt.map((isPrompt) => isPrompt.response);
      return {
        prompts: prompts,
        id: id,
        response: response,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //generate session id
  async generate() {
    try {
      const sessionId = uuidv4();
      return sessionId;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //get-history
  async getHistroy(sessionID: string) {
    try {
      const prompts = await this.promptRepo.find({
        where: { sessionId: sessionID },
      });
      if (!prompts) {
        return;
      }
      const responses = prompts.map((prompt) => ({
        prompt: prompt.prompt,
        response: prompt.response,
      }));
      return { responses };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //get paragraph
  async findOne(uid: string) {
    try {
      const user = await this.userRepo.findOne({
        where: {
          id: uid,
        },
      });
      const knowledge = await this.knowledgeRepo.find({ where: { user } });
      if (!knowledge) {
        return;
      }
      return knowledge;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(updateDto: UpdateKnowledgeDto) {
    try {
      const { userId, id, paragraph, category } = updateDto;
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new ForbiddenException('Invalid userId');
      }
      const isExistingKnowledge = await this.knowledgeRepo.findOne({
        where: { user: user, id: id },
      });
      isExistingKnowledge.paragraph = paragraph;
      isExistingKnowledge.category = category;
      return this.knowledgeRepo.save(isExistingKnowledge);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(userId: string, id: string) {
    try {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new ForbiddenException('Invalid userId');
      }
      const isExistingKnowledge = await this.knowledgeRepo.findOne({
        where: { user: user, id: id },
      });
      return await this.knowledgeRepo.remove(isExistingKnowledge);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
