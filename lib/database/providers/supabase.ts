import { DatabaseProvider } from '../index';

// Supabase provider - requires '@supabase/supabase-js' package to be installed
// Run: npm install @supabase/supabase-js

export class SupabaseDatabase implements DatabaseProvider {
  private config: any;
  private client: any = null;

  constructor(config: any) {
    this.config = config;
    console.warn('Supabase provider is not configured. Install @supabase/supabase-js package to use this provider.');
  }

  async connect(): Promise<void> {
    throw new Error('Supabase provider requires @supabase/supabase-js package. Run: npm install @supabase/supabase-js');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async create(collection: string, data: any): Promise<string> {
    throw new Error('Supabase provider not available');
  }

  async read(collection: string, id: string): Promise<any> {
    throw new Error('Supabase provider not available');
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    throw new Error('Supabase provider not available');
  }

  async delete(collection: string, id: string): Promise<void> {
    throw new Error('Supabase provider not available');
  }

  async query(collection: string, filters: any = {}): Promise<any[]> {
    throw new Error('Supabase provider not available');
  }

  async backup(): Promise<any> {
    throw new Error('Supabase provider not available');
  }

  async restore(data: any): Promise<void> {
    throw new Error('Supabase provider not available');
  }
}
