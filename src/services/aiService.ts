import OpenAI from 'openai';
import { PDFDocument } from 'pdfjs-dist';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface DiagnosticData {
  vehicleId: string;
  obd2Data: any;
  symptoms: string[];
  dtcCodes: string[];
}

interface RepairSuggestion {
  issue: string;
  solution: string;
  parts: string[];
  tools: string[];
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  warnings: string[];
}

export class AIService {
  private static instance: AIService;
  private manualCache: Map<string, string> = new Map();

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeDiagnostics(data: DiagnosticData): Promise<RepairSuggestion[]> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert automotive diagnostic AI assistant. Analyze the provided diagnostic data and suggest repairs."
          },
          {
            role: "user",
            content: JSON.stringify({
              obd2Data: data.obd2Data,
              symptoms: data.symptoms,
              dtcCodes: data.dtcCodes
            })
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return this.parseRepairSuggestions(response.choices[0].message.content || "");
    } catch (error) {
      console.error('Error analyzing diagnostics:', error);
      throw new Error('Failed to analyze diagnostic data');
    }
  }

  async loadManual(vehicleId: string, manualUrl: string): Promise<string> {
    if (this.manualCache.has(vehicleId)) {
      return this.manualCache.get(vehicleId)!;
    }

    try {
      const response = await fetch(manualUrl);
      const arrayBuffer = await response.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      let text = '';

      for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ');
      }

      this.manualCache.set(vehicleId, text);
      return text;
    } catch (error) {
      console.error('Error loading manual:', error);
      throw new Error('Failed to load vehicle manual');
    }
  }

  async getManualExplanation(vehicleId: string, query: string): Promise<string> {
    try {
      const manualText = await this.loadManual(vehicleId, ''); // Add manual URL
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are an expert automotive manual interpreter. Explain the requested information from the manual in clear, concise terms."
          },
          {
            role: "user",
            content: `Manual: ${manualText}\n\nQuery: ${query}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      console.error('Error getting manual explanation:', error);
      throw new Error('Failed to get manual explanation');
    }
  }

  private parseRepairSuggestions(content: string): RepairSuggestion[] {
    try {
      return JSON.parse(content);
    } catch {
      return [{
        issue: content,
        solution: "Please contact a professional mechanic for detailed diagnosis",
        parts: [],
        tools: [],
        estimatedTime: "Unknown",
        difficulty: "Hard",
        warnings: ["Unable to parse AI response"]
      }];
    }
  }
}