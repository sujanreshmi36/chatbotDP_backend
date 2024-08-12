import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from 'src/modules/users/dto/login-user.dto';
import * as bcrypt from "bcryptjs";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from "jsonwebtoken";
import { authConstants } from './auth.constants';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entitites/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly mailerService: MailerService,
    private config: ConfigService
  ) { }
  //register
  async create(signupDTO: CreateUserDto, token: string, role: string) {
    try {
      token = token.split(' ')[1];
      let decodedToken;

      decodedToken = await jwt.verify(token, authConstants.secret2);
      if (!decodedToken) {
        throw new ForbiddenException("Token malformed")
      }
      const { email } = decodedToken;
      const existingUser = await this.userRepo.findOne({ where: { email } });

      if (existingUser) {
        throw new ConflictException('Email address is already in use');
      }
      const salt = 10;
      const hashedPassword = await bcrypt.hash(signupDTO.password, salt);
      const user = new User();
      user.email = email;
      user.password = hashedPassword;
      user.name = signupDTO.name;
      user.role = role;
      const savedUser = await this.userRepo.save(user);
      return {
        message: "Registered Successfully.",
        data: savedUser
      }

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //get-info
  async getInfo(token: string) {
    try {

      if (!token) {
        throw new NotFoundException("token not found");
      }
      token = token.split(' ')[1];
      let decodedToken
      decodedToken = await jwt.verify(token, authConstants.secret);
      if (!decodedToken) {
        throw new ForbiddenException("Token malformed")
      }

      const { payload } = decodedToken;
      const { id } = payload;
      const user = await this.userRepo.findOne({ where: { id: id } });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      };

    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //verify email
  async getVerify(email: string) {
    try {
      const existingUser = await this.userRepo.findOne(
        {
          where: [{ email: email }]
        });


      if (existingUser) {
        throw new ForbiddenException("User already exists.");
      } else {
        //generating token

        const token = jwt.sign({ email }, authConstants.secret2, {
          expiresIn: '1d'
        });

        const frontURL = this.config.get<string>('frontURL');
        const url = `${frontURL}/signup/register/${token}`;
        const sendMail = await this.mailerService.sendMail({
          to: email,
          subject: 'Email Verification',
          text: `Please verify your email by clicking on the following link: ${url}`,
        });
        if (!sendMail) {
          throw new HttpException("couldnot send mail", HttpStatus.EXPECTATION_FAILED);
        } else {
          return "verification mail has been sent";
        }
      }
    } catch (e) {

      throw new BadRequestException(e.message);
    }
  }

  //login
  async login(loginDto: LoginDTO) {
    try {
      const user = await this.userRepo.findOne({
        where: { email: loginDto.email }
      });
      const passwordMatched = await bcrypt.compare(
        loginDto.password, user.password
      );
      if (!passwordMatched) {
        throw new ForbiddenException("Invalid credential")
      }
      const payload = {
        id: user.id,
        email: user.email
      }
      const access_token = jwt.sign({ payload }, authConstants.secret, {
        expiresIn: '60d'
      })
      return { message: "Logedin successfully.", token: access_token }
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  //forgotpassword
  async forgot(email: string) {
    try {
      const user = await this.userRepo.findOne({ where: { email: email } });
      if (!user) {
        throw new NotFoundException("User not found.");
      } else {
        //generating token
        const passkey = this.config.get<string>('PASS_KEY');
        const frontURL = this.config.get<string>('frontURL');
        const token = jwt.sign({ email }, passkey, {
          expiresIn: '1d'
        });
        const url = `${frontURL}/auth/reset-password/${token}`;
        const sendMail = await this.mailerService.sendMail({
          to: email,
          subject: 'Reset your password',
          text: `To reset your password, click on the following link: ${url}`,
        });
        if (!sendMail) {
          throw new HttpException("couldnot send mail", HttpStatus.EXPECTATION_FAILED);
        } else {
          return "verification mail has been sent";
        }
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }

  //reset-password
  async reset(newPassword: string, token: string) {
    try {
      if (!token) {
        throw new NotFoundException("Token not found");
      } else {
        token = token.split(' ')[1];
        const passkey = this.config.get<string>('PASS_KEY');
        let decodedToken;
        decodedToken = jwt.verify(token, passkey)
        if (!decodedToken) {
          return ({ message: "Token verification failed" });
        } else {
          const { email } = decodedToken;
          const salt = 10;
          const hashedPassword = await bcrypt.hash(newPassword, salt);
          const user = await this.userRepo.findOne({ where: { email: email } });
          user.password = hashedPassword;
          return {
            data: await this.userRepo.save(user),
            message: "Password changed successfully"
          }
        }
      }
    } catch (e) {
      throw new BadRequestException(e.message);
    }

  }
}