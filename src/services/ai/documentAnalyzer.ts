import { openai } from '../../config/openai';
import { supabase } from '../../config/supabase';
import { createWorker } from 'tesseract.js';
import pdf from 'pdf-parse';

export class DocumentAnalyzer {
  private async extractTextFromImage(buffer: Buffer): Promise<string> {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  }

  private async extractTextFromPDF(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }

  async analyzeDocument(userId: string, fileUrl: string): Promise<string> {
    try {
      // Download file from Supabase storage
      const { data: fileData, error: downloadError } = await supabase
        .storage
        .from('documents')
        .download(fileUrl);

      if (downloadError) {
        throw new Error(`Failed to download document: ${downloadError.message}`);
      }

      // Extract text based on file type
      const buffer = await fileData.arrayBuffer();
      const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
      let text = '';

      if (fileExtension === 'pdf') {
        text = await this.extractTextFromPDF(Buffer.from(buffer));
      } else if (['jpg', 'jpeg', 'png'].includes(fileExtension || '')) {
        text = await this.extractTextFromImage(Buffer.from(buffer));
      } else {
        text = Buffer.from(buffer).toString('utf-8');
      }

      // Analyze with OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a legal and financial document analyzer. Extract and structure the following information:
              1. Document Type
              2. Parties Involved
              3. Key Dates
              4. Financial Terms
              5. Legal Requirements
              6. Compliance Obligations
              7. Risk Factors
              8. Action Items

              Format the response in a clear, structured manner.`
          },
          {
            role: "user",
            content: `Analyze this document and provide a structured summary:\n\n${text}`
          }
        ],
        temperature: 0.3,
      });

      const analysis = response.choices[0]?.message.content;
      if (!analysis) {
        throw new Error('Failed to generate analysis');
      }

      return analysis;
    } catch (error) {
      throw new Error(`Document analysis failed: ${error.message}`);
    }
  }

  async saveAnalysis(userId: string, fileUrl: string, analysis: string) {
    const { error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        file_url: fileUrl,
        analysis
      });

    if (error) {
      throw new Error(`Failed to save analysis: ${error.message}`);
    }
  }
}