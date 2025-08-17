import { DatabaseProvider } from '../index';

// MongoDB provider - requires 'mongodb' package to be installed
// Run: npm install mongodb

export class MongoDatabase implements DatabaseProvider {
  private config: any;
  private client: any = null;
  private db: any = null;

  constructor(config: any) {
    this.config = config;
    console.warn('MongoDB provider is not configured. Install mongodb package to use this provider.');
  }

  async connect(): Promise<void> {
    throw new Error('MongoDB provider requires mongodb package. Run: npm install mongodb');
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async create(collection: string, data: any): Promise<string> {
    throw new Error('MongoDB provider not available');
  }

  async read(collection: string, id: string): Promise<any> {
    throw new Error('MongoDB provider not available');
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    throw new Error('MongoDB provider not available');
  }

  async delete(collection: string, id: string): Promise<void> {
    throw new Error('MongoDB provider not available');
  }

  async query(collection: string, filters: any = {}): Promise<any[]> {
    throw new Error('MongoDB provider not available');
  }

  async backup(): Promise<any> {
    throw new Error('MongoDB provider not available');
  }

  async restore(data: any): Promise<void> {
    throw new Error('MongoDB provider not available');
  }
}
