import { deepseek } from '../../config/deepseek';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Intent {
  category: 'legal' | 'financial' | 'compliance' | 'general';
  confidence: number;
  entities: Record<string, string>;
}

export class LegalChatbot {
  private context: ChatMessage[] = [{
    role: 'system',
    content: `You are an AI legal and financial assistant. Provide accurate, helpful responses about Indian legal and financial matters.
    - Focus on practical advice and explanations
    - Cite relevant laws and regulations when applicable
    - Maintain professional tone
    - Clarify when a matter requires professional consultation
    - Never provide specific legal advice that should come from a qualified professional`
  }];

  private async detectIntent(message: string): Promise<Intent> {
    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `Analyze the user's message and extract:
            1. Category (legal, financial, compliance, or general)
            2. Confidence score (0-1)
            3. Named entities (dates, amounts, company names, etc.)
            
            Format response as JSON.`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    return {
      category: result.category || 'general',
      confidence: result.confidence || 0,
      entities: result.entities || {}
    };
  }

  async chat(
    message: string,
    language: string = 'english',
    userId: string
  ): Promise<string> {
    try {
      // Detect intent and entities
      const intent = await this.detectIntent(message);

      // Add user message with intent context
      this.context.push({
        role: 'user',
        content: `[Intent: ${intent.category}, Confidence: ${intent.confidence}] ${message}`
      });

      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          ...this.context,
          {
            role: 'system',
            content: `Respond in ${language}. Consider that this is a ${intent.category} query with confidence ${intent.confidence}.`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const reply = response.choices[0]?.message?.content;
      
      if (!reply) {
        throw new Error('No response generated');
      }

      // Add assistant's response to context
      this.context.push({
        role: 'assistant',
        content: reply
      });

      // Keep context manageable by limiting to last 10 messages
      if (this.context.length > 10) {
        this.context = [
          this.context[0], // Keep system message
          ...this.context.slice(-9) // Keep last 9 messages
        ];
      }

      return reply;
    } catch (error) {
      throw new Error(`Chat generation failed: ${error.message}`);
    }
  }

  clearContext() {
    this.context = [this.context[0]]; // Keep only system message
  }
}