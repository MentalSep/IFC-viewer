import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return {
      status: "ok",
      message: "✅ CoBIM API is running",
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: "/api/auth/register, /api/auth/login",
        projects: "/api/projects (CRUD)",
        documents: "/api/documents (upload, version control)",
      },
    };
  }
}
