import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from 'src/middleware/strategies/jwt.strategy';
import { mailerConfig } from 'src/config/mail.config';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entitites/user.entity';
import { authConstants } from './auth.constants';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: authConstants.secret }), mailerConfig],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, ConfigService], //ConfigService in both providers and exports
  exports: [AuthService, ConfigService]
})
export class AuthModule { }
