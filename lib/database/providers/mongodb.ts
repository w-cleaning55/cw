import { DatabaseProvider } from "../index";

// MongoDB provider - requires 'mongodb' package to be installed
// Run: npm install mongodb

export class MongoDatabase implements DatabaseProvider {
  private config: any;
  private client: any = null;
  private db: any = null;

  constructor(config: any) {
    this.config = config;
    console.warn(
      "MongoDB provider is not configured. Install mongodb package to use this provider.",
    );
  }

  async connect(): Promise<boolean> {
    throw new Error(
      "MongoDB provider requires mongodb package. Run: npm install mongodb",
    );
  }

  async disconnect(): Promise<void> {
    // No-op
  }

  async testConnection(config?: any): Promise<{ success: boolean; message: string; metadata?: any; } | boolean> {
    return false;
  }

  async getDatabaseStatus(config: any): Promise<{ isEmpty: boolean; hasIncompatibleSchema: boolean; hasOldSchema: boolean; }> {
    return { isEmpty: true, hasIncompatibleSchema: false, hasOldSchema: false };
  }

  async createTable(config: any, table: any): Promise<void> {
    throw new Error("MongoDB provider not available");
  }

  async createIndex(config: any, index: any): Promise<void> {
    throw new Error("MongoDB provider not available");
  }

  async createRelation(config: any, relation: any): Promise<void> {
    throw new Error("MongoDB provider not available");
  }

  async insertBatch(config: any, tableName: string, records: any[]): Promise<void> {
    throw new Error("MongoDB provider not available");
  }

  async truncateTable(config: any, tableName: string): Promise<void> {
    throw new Error("MongoDB provider not available");
  }

  async findAll(config: any, tableName: string, filters?: any): Promise<any[]> {
    throw new Error("MongoDB provider not available");
  }

  async backup(config: any, options?: any): Promise<any> {
    throw new Error("MongoDB provider not available");
  }

  async restore(config: any, data: any, options?: any): Promise<boolean> {
    throw new Error("MongoDB provider not available");
  }

  async create(collection: string, data: any): Promise<any> {
    throw new Error("MongoDB provider not available");
  }

  async read(collection: string, id?: string): Promise<any> {
    throw new Error("MongoDB provider not available");
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    throw new Error("MongoDB provider not available");
  }

  async delete(collection: string, id: string): Promise<boolean> {
    throw new Error("MongoDB provider not available");
  }

  async query(collection: string, filters: any): Promise<any[]> {
    throw new Error("MongoDB provider not available");
  }

  async count(collection: string, filters?: any): Promise<number> {
    throw new Error("MongoDB provider not available");
  }
}
