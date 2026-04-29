import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "../users/user.entity";
import { Project } from "./project.entity";

@Entity("project_members")
export class ProjectMember {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  projectId: string;

  @Column()
  userId: string;

  @Column({ default: "viewer" })
  role: "owner" | "editor" | "viewer";

  @CreateDateColumn()
  joinedAt: Date;

  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: "CASCADE",
  })
  project: Project;

  @ManyToOne(() => User, (user) => user.projectMemberships, {
    onDelete: "CASCADE",
  })
  user: User;
}
