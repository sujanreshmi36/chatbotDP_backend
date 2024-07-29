import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }
 
    //update user
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateuserDTO: UpdateUserDto) {
        return this.usersService.update(id, updateuserDTO)
    }

    //delete user
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

       // @Get()
    // findAll(){
    //     return this.usersService.findAll();
    // }
    // @Get(':id')
    // findOne(@Param('id' )id:string){
    //     return this.usersService.findOne(id);
    // }
}
