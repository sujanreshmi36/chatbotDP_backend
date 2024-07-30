import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { User } from './entitites/user.entity';
import { Knowledge } from './entitites/knowledge.entity';
import { ApiModule } from './modules/api/api.module';
import { EnquiryModule } from './modules/enquiry/enquiry.module';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ConfigModule.forRoot(),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      synchronize: true,
      logging: false,
      entities: [join(process.cwd(), 'dist/**/*.entity.js')],
    })
  }), UsersModule, AuthModule, KnowledgeModule, ApiModule, EnquiryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
