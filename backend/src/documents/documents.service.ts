import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { Document } from "./document.entity";
import { DocumentVersion } from "./document-version.entity";

interface UploadFile {
  originalname: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
}

@Injectable()
export class DocumentsService {
  private uploadDir = process.env.FILE_UPLOAD_DIR || "./uploads";

  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(DocumentVersion)
    private versionsRepository: Repository<DocumentVersion>,
  ) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadDocument(projectId: string, file: UploadFile, name?: string) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Create document record
    const document = this.documentsRepository.create({
      projectId,
      name: name || file.originalname,
      fileName,
      fileSize: file.size,
      mimeType: file.mimetype,
      currentVersionNumber: 1,
    });

    const savedDocument = await this.documentsRepository.save(document);

    // Create initial version
    const version = this.versionsRepository.create({
      documentId: savedDocument.id,
      versionNumber: 1,
      fileName,
      fileSize: file.size,
      isActive: true,
    });

    await this.versionsRepository.save(version);

    return savedDocument;
  }

  async getProjectDocuments(projectId: string) {
    return await this.documentsRepository.find({
      where: { projectId },
      relations: ["versions"],
    });
  }

  async getDocumentVersions(documentId: string) {
    return await this.versionsRepository.find({
      where: { documentId },
      order: { versionNumber: "DESC" },
    });
  }

  async activateVersion(documentId: string, versionId: string) {
    // Deactivate all versions for this document
    await this.versionsRepository.update({ documentId }, { isActive: false });

    // Activate the specified version
    const version = await this.versionsRepository.findOne({
      where: { id: versionId },
    });

    if (!version) {
      throw new Error("Version not found");
    }

    await this.versionsRepository.update(versionId, { isActive: true });

    // Update document's current version
    await this.documentsRepository.update(
      { id: documentId },
      { currentVersionNumber: version.versionNumber },
    );

    return version;
  }

  async deleteDocument(documentId: string) {
    const document = await this.documentsRepository.findOne({
      where: { id: documentId },
      relations: ["versions"],
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // Delete files from disk
    document.versions.forEach((version) => {
      const filePath = path.join(this.uploadDir, version.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Delete from database
    await this.documentsRepository.delete(documentId);

    return { success: true };
  }

  getDownloadPath(fileName: string) {
    return path.join(this.uploadDir, fileName);
  }
}
