import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Message, MessageType } from "./message.entity";
import { User } from "../users/user.entity";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveMessage(
    senderId: string,
    receiverId: string,
    content: string,
    type: MessageType = "text",
    fileData?: { fileName: string; fileUrl: string; fileSize: number },
  ) {
    const message = this.messageRepository.create({
      senderId, receiverId, content, type,
      isRead: false,
      ...(fileData || {}),
    });
    return await this.messageRepository.save(message);
  }

  async getConversation(userId1: string, userId2: string) {
    return await this.messageRepository.find({
      where: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
      order: { createdAt: "ASC" },
    });
  }

  async markAsRead(senderId: string, receiverId: string) {
    await this.messageRepository.update(
      { senderId, receiverId, isRead: false },
      { isRead: true },
    );
  }

  async getAllUsers(currentUserId: string) {
    return await this.userRepository.find({
      select: ["id", "name", "email", "role"],
    });
  }

  async getUnreadPerSender(receiverId: string) {
    return await this.messageRepository
      .createQueryBuilder("msg")
      .select("msg.senderId", "senderId")
      .addSelect("COUNT(*)", "count")
      .where("msg.receiverId = :receiverId AND msg.isRead = false", { receiverId })
      .groupBy("msg.senderId")
      .getRawMany();
  }
}