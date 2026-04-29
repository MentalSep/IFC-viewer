import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { ProjectsModule } from "./projects/projects.module";
import { DocumentsModule } from "./documents/documents.module";
import { User } from "./users/user.entity";
import { Project } from "./projects/project.entity";
import { ProjectMember } from "./projects/project-member.entity";
import { Document } from "./documents/document.entity";
import { DocumentVersion } from "./documents/document-version.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "3306"),
      username: process.env.DATABASE_USER || "root",
      password: process.env.DATABASE_PASSWORD || "",
      database: process.env.DATABASE_NAME || "cobim_cde_dev",
      entities: [User, Project, ProjectMember, Document, DocumentVersion],
      synchronize: true, // Auto-create tables (use migrations in production)
      logging: true,
    }),
    AuthModule,
    ProjectsModule,
    DocumentsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
