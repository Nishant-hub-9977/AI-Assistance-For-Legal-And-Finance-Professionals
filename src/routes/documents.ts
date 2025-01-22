import { Router } from 'express';
import { uploadAndAnalyzeDocument, getDocuments } from '../controllers/documents';
import { authenticate, checkRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Allow professionals and admins to analyze documents
router.post('/analyze', 
  checkRole(['admin', 'professional']),
  uploadAndAnalyzeDocument
);

router.get('/', getDocuments);

export default router;