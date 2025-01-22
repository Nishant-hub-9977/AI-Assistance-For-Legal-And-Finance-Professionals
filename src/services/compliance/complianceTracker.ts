import { supabase } from '../../config/supabase';
import { Database } from '../../types/supabase';

type ComplianceType = Database['public']['Tables']['compliance']['Row']['type'];
type ComplianceStatus = Database['public']['Tables']['compliance']['Row']['status'];

interface ComplianceReminder {
  id: string;
  type: ComplianceType;
  deadline: string;
  status: ComplianceStatus;
  daysRemaining: number;
}

export class ComplianceTracker {
  async getUpcomingDeadlines(userId: string): Promise<ComplianceReminder[]> {
    const { data: compliance, error } = await supabase
      .from('compliance')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'PENDING')
      .order('deadline', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch compliance deadlines: ${error.message}`);
    }

    return compliance.map(item => ({
      id: item.id,
      type: item.type,
      deadline: item.deadline,
      status: item.status,
      daysRemaining: Math.ceil(
        (new Date(item.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
    }));
  }

  async addComplianceDeadline(
    userId: string,
    type: ComplianceType,
    deadline: string
  ) {
    const { error } = await supabase
      .from('compliance')
      .insert({
        user_id: userId,
        type,
        deadline,
        status: 'PENDING'
      });

    if (error) {
      throw new Error(`Failed to add compliance deadline: ${error.message}`);
    }
  }

  async updateComplianceStatus(
    userId: string,
    complianceId: string,
    status: ComplianceStatus
  ) {
    const { error } = await supabase
      .from('compliance')
      .update({ status })
      .eq('id', complianceId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to update compliance status: ${error.message}`);
    }
  }

  async getComplianceStats(userId: string) {
    const { data: compliance, error } = await supabase
      .from('compliance')
      .select('type, status')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch compliance stats: ${error.message}`);
    }

    const stats = {
      total: compliance.length,
      pending: compliance.filter(item => item.status === 'PENDING').length,
      completed: compliance.filter(item => item.status === 'COMPLETED').length,
      byType: {} as Record<ComplianceType, { pending: number; completed: number }>
    };

    compliance.forEach(item => {
      if (!stats.byType[item.type]) {
        stats.byType[item.type] = { pending: 0, completed: 0 };
      }
      stats.byType[item.type][item.status.toLowerCase() as 'pending' | 'completed']++;
    });

    return stats;
  }
}