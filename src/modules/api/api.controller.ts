import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { RunApi } from './dto/run-api.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateApiDto } from './dto/update-api.dto';

@Controller('api')
@ApiTags('API Key')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @Get('get-api/:api_key')
  findOne(@Param('api_key') api_Key: string) {
    return this.apiService.findOne(api_Key);
  }


  @UseGuards(JwtAuthGuard)
  @Post('generate')
  create(@Body() createApiDto: CreateApiDto, @Req() req) {
    const { payload } = req.user.data;
    return this.apiService.create(createApiDto, payload.id);
  }


  @Post('run')
  run(@Body() runApi: RunApi) {
    return this.apiService.run(runApi);
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-info')
  getInfo(@Req() req) {
    const { payload } = req.user.data;
    return this.apiService.getInfo(payload.id);
  }


  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Req() req, @Body() updateapi: UpdateApiDto) {
    const { payload } = req.user.data;
    return this.apiService.change(payload.id, updateapi);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':api_key')
  remove(@Param('api_key') api_key: string) {
    return this.apiService.remove(api_key);
  }

}
