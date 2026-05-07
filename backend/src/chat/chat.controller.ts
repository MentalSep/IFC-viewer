import {
  Controller, Get, Param, Post,
  UploadedFile, UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get("users")
  async getUsers() {
    return await this.chatService.getAllUsers("");
  }

  @Get("conversation/:userId1/:userId2")
  async getConversation(
    @Param("userId1") userId1: string,
    @Param("userId2") userId2: string,
  ) {
    return await this.chatService.getConversation(userId1, userId2);
  }

  @Get("unread/:userId")
  async getUnread(@Param("userId") userId: string) {
    return await this.chatService.getUnreadPerSender(userId);
  }

  // ✅ File upload endpoint
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: join(process.cwd(), "uploads"),
        filename: (_req, file, cb) => {
          const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.originalname,
      fileUrl: `http://localhost:3001/uploads/${file.filename}`,
      fileSize: file.size,
    };
  }
}