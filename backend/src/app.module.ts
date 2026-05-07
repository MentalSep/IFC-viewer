import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ProjectsModule } from "./projects/projects.module";
import { DocumentsModule } from "./documents/documents.module";
import { ChatModule } from "./chat/chat.module";
import { User } from "./users/user.entity";
import { Project } from "./projects/project.entity";
import { ProjectMember } from "./projects/project-member.entity";
import { Document } from "./documents/document.entity";
import { DocumentVersion } from "./documents/document-version.entity";
import { Message } from "./chat/message.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "3306"),
      username: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD || "",
      database: process.env.DATABASE_NAME || "cobim_cde_dev",
      entities: [User, Project, ProjectMember, Document, DocumentVersion, Message],
      synchronize: true,
      logging: false,
    }),
    // ✅ Serve uploaded files statically
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), "uploads"),
      serveRoot: "/uploads",
    }),
    AuthModule,
    ProjectsModule,
    DocumentsModule,
    ChatModule,
  ],
  controllers: [AppController],
})
export class AppModule {}