import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ComplianceTracker } from '../services/compliance/complianceTracker';
import { Database } from '../types/supabase';

type ComplianceType = Database['public']['Tables']['compliance']['Row']['type'];
type ComplianceStatus = Database['public']['Tables']['compliance']['Row']['status'];

const complianceTracker = new ComplianceTracker();

export const getUpcomingDeadlines = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const deadlines = await complianceTracker.getUpcomingDeadlines(req.user.id);
    res.json(deadlines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deadlines' });
  }
};

export const addComplianceDeadline = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { type, deadline } = req.body;

  if (!type || !deadline) {
    return res.status(400).json({ error: 'Type and deadline are required' });
  }

  try {
    await complianceTracker.addComplianceDeadline(
      req.user.id,
      type as ComplianceType,
      deadline
    );
    res.status(201).json({ message: 'Compliance deadline added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add compliance deadline' });
  }
};

export const updateComplianceStatus = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { complianceId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    await complianceTracker.updateComplianceStatus(
      req.user.id,
      complianceId,
      status as ComplianceStatus
    );
    res.json({ message: 'Compliance status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update compliance status' });
  }
};

export const getComplianceStats = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const stats = await complianceTracker.getComplianceStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance stats' });
  }
};