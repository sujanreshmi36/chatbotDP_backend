import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { log } from 'console';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }

  @UseGuards(JwtAuthGuard)
  @Get('get-api')
  findOne(@Req() req) 
  {
    const {payload}=req.user.data;    
    return this.apiService.findOne(payload.id);
  }


  @UseGuards(JwtAuthGuard)
  @Post('generate')
  create(@Body() createApiDto: CreateApiDto, @Req() req) {
    const {payload}=req.user.data;    
    return this.apiService.create(createApiDto, payload.id);
  }




    // @Get()
  // findAll() {
  //   return this.apiService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateApiDto: UpdateApiDto) {
  //   return this.apiService.update(+id, updateApiDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.apiService.remove(+id);
  // }
}
