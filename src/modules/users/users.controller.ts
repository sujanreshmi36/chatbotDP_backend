import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, Req, MaxFileSizeValidator, FileTypeValidator, ParseFilePipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('User')
export class UsersController {
    constructor(private usersService: UsersService) { }


    //delete user
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    //uploading profile
    @UseGuards(JwtAuthGuard)
    @Patch('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./uploads",
            filename: (req, file, cb) => {
                const uniqueSuffix = new Date().toISOString().replace(/:/g, '-') + '-';
                cb(null, `${file.originalname}-${uniqueSuffix}${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`);
            }
        })
    }))
    async upload(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 5 MB size limit
                new FileTypeValidator({ fileType: /jpeg|jpg|png/ }) // Allow jpg, jpeg, png
            ],
        })) file, @Req() req) {
        const filename = file?.filename;
        const { payload } = req.user.data;
        return this.usersService.upload(filename, payload.id);
    }
 
}
