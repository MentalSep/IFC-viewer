import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import * as fs from "fs";
import { DocumentsService } from "./documents.service";

interface UploadFile {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
}

@Controller("documents")
@UseGuards(AuthGuard("jwt"))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post(":projectId/upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadDocument(
    @Param("projectId") projectId: string,
    @UploadedFile() file: UploadFile,
    @Body() body?: { name?: string },
  ) {
    return await this.documentsService.uploadDocument(
      projectId,
      file,
      body?.name,
    );
  }

  @Get("project/:projectId")
  async getProjectDocuments(@Param("projectId") projectId: string) {
    return await this.documentsService.getProjectDocuments(projectId);
  }

  @Get(":documentId/versions")
  async getDocumentVersions(@Param("documentId") documentId: string) {
    return await this.documentsService.getDocumentVersions(documentId);
  }

  @Put(":documentId/versions/:versionId/activate")
  async activateVersion(
    @Param("documentId") documentId: string,
    @Param("versionId") versionId: string,
  ) {
    return await this.documentsService.activateVersion(documentId, versionId);
  }

  @Get(":documentId/download/:versionId")
  async downloadDocument(
    @Param("documentId") documentId: string,
    @Param("versionId") versionId: string,
    @Res() res: Response,
  ) {
    const filePath = this.documentsService.getDownloadPath(
      `${Date.now()}-placeholder.ifc`,
    );

    // In production, fetch the actual file path from the database
    // For now, send a placeholder response
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  }

  @Delete(":documentId")
  async deleteDocument(@Param("documentId") documentId: string) {
    return await this.documentsService.deleteDocument(documentId);
  }
}
