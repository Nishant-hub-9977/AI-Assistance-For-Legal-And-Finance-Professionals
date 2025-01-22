import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { DocumentAnalyzer } from '../services/ai/documentAnalyzer';
import { supabase } from '../config/supabase';

const documentAnalyzer = new DocumentAnalyzer();

export const uploadAndAnalyzeDocument = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (!req.files?.document) {
    return res.status(400).json({ error: 'No document provided' });
  }

  try {
    const file = req.files.document;
    const timestamp = Date.now();
    const filePath = `${req.user.id}/${timestamp}-${file.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(filePath, file.data);

    if (uploadError) {
      return res.status(500).json({ error: 'File upload failed' });
    }

    // Analyze the document
    const analysis = await documentAnalyzer.analyzeDocument(req.user.id, filePath);

    // Save analysis to database
    await documentAnalyzer.saveAnalysis(req.user.id, filePath, analysis);

    res.json({
      message: 'Document analyzed successfully',
      analysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Document analysis failed' });
  }
};

export const getDocuments = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};