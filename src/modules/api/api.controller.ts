import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) { }
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  create(@Body() createApiDto: CreateApiDto, @Req() req) {
    const { id } = req.user;
    return this.apiService.create(createApiDto, id);
  }

  // @Get()
  // findAll() {
  //   return this.apiService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.apiService.findOne(+id);
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
