import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { log } from 'console';
import { RunApi } from './dto/run-api.dto';
import { ApiTags } from '@nestjs/swagger';
import { getInfoDTO } from './dto/get-info.dto';
import { UpdateApiDto } from './dto/update-api.dto';

@Controller('api')
@ApiTags('API Key')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @UseGuards(JwtAuthGuard)
  @Get('get-api')
  findOne(@Req() req) {
    const { payload } = req.user.data;
    return this.apiService.findOne(payload.id);
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

  @Post('get-info')
  getInfo(@Body() getInfoDto: getInfoDTO) {
    return this.apiService.getInfo(getInfoDto);
  }


  @UseGuards(JwtAuthGuard)
  @Patch()
  update(@Req() req, @Body() updateapi: UpdateApiDto) {
    const { payload } = req.user.data;
    return this.apiService.change(payload.id, updateapi);
  }

}
