import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Project } from "../projects/project.entity";
import { DocumentVersion } from "./document-version.entity";

@Entity("documents")
export class Document {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  projectId: string;

  @Column({ type: "bigint" })
  fileSize: number;

  @Column()
  mimeType: string;

  @Column()
  fileName: string;

  @Column({ default: 1 })
  currentVersionNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Project, (project) => project.documents, {
    onDelete: "CASCADE",
  })
  project: Project;

  @OneToMany(() => DocumentVersion, (version) => version.document)
  versions: DocumentVersion[];
}
