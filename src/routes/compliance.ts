import { Router } from 'express';
import {
  getUpcomingDeadlines,
  addComplianceDeadline,
  updateComplianceStatus,
  getComplianceStats
} from '../controllers/compliance';
import { authenticate, checkRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Routes accessible to all authenticated users
router.get('/deadlines', getUpcomingDeadlines);
router.get('/stats', getComplianceStats);

// Routes restricted to professionals and admins
router.post('/deadlines',
  checkRole(['admin', 'professional']),
  addComplianceDeadline
);

router.patch('/deadlines/:complianceId/status',
  checkRole(['admin', 'professional']),
  updateComplianceStatus
);

export default router;