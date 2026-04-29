import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./project.entity";
import { User } from "../users/user.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async createProject(user: User, name: string, description?: string) {
    const project = this.projectsRepository.create({
      name,
      description,
      owner: user,
      ownerId: user.id,
      status: "active",
    });

    return await this.projectsRepository.save(project);
  }

  async getUserProjects(userId: string) {
    return await this.projectsRepository.find({
      where: { ownerId: userId },
      relations: ["members", "documents"],
    });
  }

  async getProjectById(projectId: string) {
    return await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ["owner", "members", "documents"],
    });
  }

  async updateProject(projectId: string, updates: Partial<Project>) {
    await this.projectsRepository.update(projectId, updates);
    return await this.getProjectById(projectId);
  }

  async deleteProject(projectId: string) {
    await this.projectsRepository.delete(projectId);
    return { success: true };
  }
}
