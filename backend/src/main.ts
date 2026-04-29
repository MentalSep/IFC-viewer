// Load environment variables FIRST using require to ensure synchronous loading
require("dotenv").config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`✅ CoBIM API running on http://localhost:${port}`);
    console.log(
      `📡 CORS enabled for: ${process.env.CORS_ORIGIN || "http://localhost:5173"}`,
    );
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
