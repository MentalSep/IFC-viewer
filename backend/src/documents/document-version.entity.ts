import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Document } from "./document.entity";

@Entity("document_versions")
export class DocumentVersion {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  documentId: string;

  @Column()
  versionNumber: number;

  @Column()
  fileName: string;

  @Column({ type: "bigint" })
  fileSize: number;

  @Column({ nullable: true })
  changelog: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Document, (document) => document.versions, {
    onDelete: "CASCADE",
  })
  document: Document;
}
