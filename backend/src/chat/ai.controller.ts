import { Controller, Post, Body } from "@nestjs/common";
import Groq from "groq-sdk";
import * as dotenv from "dotenv";
import * as path from "path";

// Force load .env avant tout
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface AIMessageDto {
  role: "user" | "assistant";
  content: string;
}

@Controller("ai")
export class AiController {
  private groq: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    console.log("GROQ KEY loaded:", apiKey ? "✅ YES" : "❌ NO");
    
    this.groq = new Groq({ apiKey });
  }

  @Post("chat")
  async chat(@Body() body: { messages: AIMessageDto[] }) {
    try {
      const completion = await this.groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: `Tu es un assistant expert en BIM (Building Information Modeling), construction, et gestion de projets.
Tu maîtrises les normes ISO 19650, IFC, le workflow CDE, et toutes les disciplines: bâtiment, ouvrage d'art, infrastructure routière.
Tu connais parfaitement la plateforme CoBIM Cloud qui est un Common Data Environment (CDE) conforme ISO 19650.
Réponds en français de manière précise, professionnelle et utile.`,
          },
          ...body.messages,
        ],
      });

      const text = completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu répondre.";
      return { content: text };
    } catch (error) {
      console.error("Groq error:", error);
      throw error;
    }
  }
}