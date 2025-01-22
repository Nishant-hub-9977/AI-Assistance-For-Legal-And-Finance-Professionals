import nodemailer from 'nodemailer';
import { ComplianceReminder } from '../compliance/complianceTracker';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendComplianceReminder(
    to: string,
    reminder: ComplianceReminder
  ): Promise<void> {
    const subject = `Compliance Reminder: ${reminder.type} Due in ${reminder.daysRemaining} Days`;
    
    const html = `
      <h2>Compliance Deadline Reminder</h2>
      <p>This is a reminder about your upcoming compliance deadline:</p>
      <ul>
        <li><strong>Type:</strong> ${reminder.type}</li>
        <li><strong>Deadline:</strong> ${new Date(reminder.deadline).toLocaleDateString()}</li>
        <li><strong>Days Remaining:</strong> ${reminder.daysRemaining}</li>
      </ul>
      <p>Please ensure to complete the necessary filings before the deadline.</p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });
  }

  async sendDocumentAnalysisComplete(
    to: string,
    documentName: string,
    analysisUrl: string
  ): Promise<void> {
    const subject = 'Document Analysis Complete';
    
    const html = `
      <h2>Document Analysis Complete</h2>
      <p>The analysis of your document "${documentName}" is now complete.</p>
      <p><a href="${analysisUrl}">Click here to view the analysis</a></p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html
    });
  }
}