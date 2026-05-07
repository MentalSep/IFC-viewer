import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { AiController } from "./ai.controller";
import { Message } from "./message.entity";
import { User } from "../users/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User]),
    MulterModule.register({ dest: join(process.cwd(), "uploads") }),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController, AiController],
})
export class ChatModule {} 