import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Header, Headers, Query, Res, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDTO } from 'src/modules/users/dto/login-user.dto';
import { JwtAuthGuard } from 'src/middleware/guards/jwt.guard';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //get email for verification
  @Post('get-verify')
  getVerify(@Body() body: { email: string }) {
    return this.authService.getVerify(body.email);
  }

  //verify token and register the user
  @Post('register')
  create(@Body() createuserdto: CreateUserDto, @Headers('Authorization') token: string, @Query('role') role: string) {
    if (!token || !role) {
      throw new ForbiddenException("Insufficient payload")
    }
    return this.authService.create(createuserdto, token, role);
  }

  //login
  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  //getId
  @Post('get-info')
  getInfo(@Headers('Authorization') token: string) {
    return this.authService.getInfo(token);
  }
  //forgot-password
  @Post('forgot-password')
  forgot(@Body() body: { email: string }) {
    return this.authService.forgot(body.email);
  }

  //rest-password
  @Post('reset-password')
  reset(@Body() body: { password: string }, @Headers('Authorization') token: string) {
    return this.authService.reset(body.password, token);
  }

}
