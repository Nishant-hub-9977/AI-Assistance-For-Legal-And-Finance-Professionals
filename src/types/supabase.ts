export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'professional' | 'client';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'admin' | 'professional' | 'client';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'professional' | 'client';
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          file_url: string;
          analysis: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_url: string;
          analysis?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_url?: string;
          analysis?: string | null;
          created_at?: string;
        };
      };
      compliance: {
        Row: {
          id: string;
          user_id: string;
          type: 'GST' | 'INCOME_TAX' | 'ROC';
          deadline: string;
          status: 'PENDING' | 'COMPLETED';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'GST' | 'INCOME_TAX' | 'ROC';
          deadline: string;
          status?: 'PENDING' | 'COMPLETED';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'GST' | 'INCOME_TAX' | 'ROC';
          deadline?: string;
          status?: 'PENDING' | 'COMPLETED';
          created_at?: string;
        };
      };
    };
  };
}