import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request as ExpressRequest } from "express";
import { ProjectsService } from "./projects.service";

@Controller("projects")
@UseGuards(AuthGuard("jwt"))
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  async createProject(
    @Request() req: ExpressRequest,
    @Body() body: { name: string; description?: string },
  ) {
    return await this.projectsService.createProject(
      req.user as any,
      body.name,
      body.description,
    );
  }

  @Get()
  async getUserProjects(@Request() req: ExpressRequest) {
    return await this.projectsService.getUserProjects((req.user as any).id);
  }

  @Get(":id")
  async getProject(@Param("id") projectId: string) {
    return await this.projectsService.getProjectById(projectId);
  }

  @Put(":id")
  async updateProject(
    @Param("id") projectId: string,
    @Body() body: Partial<any>,
  ) {
    return await this.projectsService.updateProject(projectId, body);
  }

  @Delete(":id")
  async deleteProject(@Param("id") projectId: string) {
    return await this.projectsService.deleteProject(projectId);
  }
}
