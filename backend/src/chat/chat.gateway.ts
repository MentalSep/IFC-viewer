import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  OnGatewayConnection, OnGatewayDisconnect,
  MessageBody, ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { MessageType } from "./message.entity";

@WebSocketGateway({ cors: { origin: "*" }, namespace: "/chat" })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedUsers = new Map<string, string>();
  private userNames = new Map<string, string>();

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    const userName = client.handshake.query.userName as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      if (userName) this.userNames.set(userId, userName);
      this.server.emit("users_online", Array.from(this.connectedUsers.keys()));
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        break;
      }
    }
    this.server.emit("users_online", Array.from(this.connectedUsers.keys()));
  }

  @SubscribeMessage("send_message")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      senderId: string; senderName: string;
      receiverId: string; content: string;
      type?: string;
      fileName?: string; fileUrl?: string; fileSize?: number;
    },
  ) {
    const msgType = (data.type || "text") as MessageType;

    // ✅ Fix: check all fields before passing fileData
    const fileData = (data.fileName && data.fileUrl && data.fileSize !== undefined)
      ? { fileName: data.fileName, fileUrl: data.fileUrl, fileSize: data.fileSize }
      : undefined;

    const message = await this.chatService.saveMessage(
      data.senderId, data.receiverId, data.content, msgType, fileData,
    );

    const senderName = data.senderName || this.userNames.get(data.senderId) || "Quelqu'un";
    const receiverSocketId = this.connectedUsers.get(data.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit("new_message", message);
      // ✅ Fix: use string comparison directly
      const isSystemMsg = msgType === "call_missed" || msgType === "call_ended";
      if (!isSystemMsg) {
        this.server.to(receiverSocketId).emit("notification", {
          senderId: data.senderId, senderName, content: data.content,
        });
      }
    }

    client.emit("message_sent", message);
    return message;
  }

  @SubscribeMessage("mark_read")
  async handleMarkRead(@MessageBody() data: { senderId: string; receiverId: string }) {
    await this.chatService.markAsRead(data.senderId, data.receiverId);
  }

  @SubscribeMessage("call_offer")
  handleCallOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; from: any; type: string; offer: any },
  ) {
    const receiverSocketId = this.connectedUsers.get(data.to);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit("call_offer", {
        from: data.from, type: data.type, offer: data.offer,
      });
      this.server.to(receiverSocketId).emit("call_ring");
    } else {
      client.emit("call_user_offline");
    }
  }

  @SubscribeMessage("call_answer")
  handleCallAnswer(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { to: string; answer: any },
  ) {
    const socketId = this.connectedUsers.get(data.to);
    if (socketId) this.server.to(socketId).emit("call_answer", { answer: data.answer });
  }

  @SubscribeMessage("call_ice")
  handleIce(
    @ConnectedSocket() _client: Socket,
    @MessageBody() data: { to: string; candidate: any },
  ) {
    const socketId = this.connectedUsers.get(data.to);
    if (socketId) this.server.to(socketId).emit("call_ice", { candidate: data.candidate });
  }

  @SubscribeMessage("call_ended")
  async handleCallEnded(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {
      to: string; senderId: string; receiverId: string;
      duration?: number; missed?: boolean;
    },
  ) {
    const socketId = this.connectedUsers.get(data.to);
    if (socketId) this.server.to(socketId).emit("call_ended");

    if (data.senderId && data.receiverId) {
      if (data.missed) {
        const msg = await this.chatService.saveMessage(
          data.senderId, data.receiverId, "📵 Appel manqué", "call_missed",
        );
        client.emit("message_sent", msg);
        if (socketId) this.server.to(socketId).emit("new_message", msg);
      } else if (data.duration !== undefined) {
        const mins = Math.floor(data.duration / 60);
        const secs = data.duration % 60;
        const durationStr = mins > 0 ? `${mins} min ${secs} sec` : `${secs} sec`;
        const msg = await this.chatService.saveMessage(
          data.senderId, data.receiverId,
          `📞 Appel terminé • ${durationStr}`, "call_ended",
        );
        client.emit("message_sent", msg);
        if (socketId) this.server.to(socketId).emit("new_message", msg);
      }
    }
  }

  @SubscribeMessage("call_reject")
  async handleCallReject(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; senderId: string; receiverId: string },
  ) {
    const socketId = this.connectedUsers.get(data.to);
    if (socketId) this.server.to(socketId).emit("call_ended");

    if (data.senderId && data.receiverId) {
      const msg = await this.chatService.saveMessage(
        data.senderId, data.receiverId, "📵 Appel manqué", "call_missed",
      );
      client.emit("message_sent", msg);
      if (socketId) this.server.to(socketId).emit("new_message", msg);
    }
  }
}