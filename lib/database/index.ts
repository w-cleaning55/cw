// Dynamic imports for client-side compatibility

export type DatabaseType = "firebase" | "supabase" | "mongodb";

export interface DatabaseConfig {
  type: DatabaseType;
  config: Record<string, any>;
  isActive: boolean;
  lastTested?: string;
  connectionStatus?: "connected" | "disconnected" | "error";
}

export interface DatabaseProvider {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  testConnection(config?: any): Promise<{ success: boolean; message: string; metadata?: any; } | boolean>;

  // CRUD Operations
  create(collection: string, data: any): Promise<any>;
  read(collection: string, id?: string): Promise<any>;
  update(collection: string, id: string, data: any): Promise<any>;
  delete(collection: string, id: string): Promise<boolean>;

  // Advanced Operations
  query(collection: string, filters: any): Promise<any[]>;
  count(collection: string, filters?: any): Promise<number>;
  backup(config: any, options?: any): Promise<any>;
  restore(config: any, data: any, options?: any): Promise<boolean>;
  getDatabaseStatus(config: any): Promise<{ isEmpty: boolean; hasIncompatibleSchema: boolean; hasOldSchema: boolean; }>;
  createTable(config: any, table: any): Promise<void>;
  createIndex(config: any, index: any): Promise<void>;
  createRelation(config: any, relation: any): Promise<void>;
  insertBatch(config: any, tableName: string, records: any[]): Promise<void>;
  truncateTable(config: any, tableName: string): Promise<void>;
  findAll(config: any, tableName: string, filters?: any): Promise<any[]>;
}

class DatabaseManager {
  private currentProvider: DatabaseProvider | null = null;
  private config: DatabaseConfig | null = null;

  async initialize(config: DatabaseConfig): Promise<boolean> {
    try {
      this.config = config;

      switch (config.type) {
        case "firebase":
          const { FirebaseDatabase } = await import("./providers/firebase");
          this.currentProvider = new FirebaseDatabase(config.config);
          break;
        case "supabase":
          const { SupabaseDatabase } = await import("./providers/supabase");
          this.currentProvider = new SupabaseDatabase(config.config);
          break;
        case "mongodb":
          const { MongoDatabase } = await import("./providers/mongodb");
          this.currentProvider = new MongoDatabase(config.config);
          break;
        default:
          throw new Error(`Unsupported database type: ${config.type}`);
      }

      const connected = await this.currentProvider.connect();

      if (connected) {
        config.connectionStatus = "connected";
        config.lastTested = new Date().toISOString();
      } else {
        config.connectionStatus = "error";
      }

      return connected;
    } catch (error) {
      console.error("Database initialization failed:", error);
      if (this.config) {
        this.config.connectionStatus = "error";
      }
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.currentProvider) return false;

    try {
      const result = await this.currentProvider.testConnection(this.config?.config);
      const success = typeof result === 'boolean' ? result : result.success;
      if (this.config) {
        this.config.connectionStatus = success ? "connected" : "error";
        this.config.lastTested = new Date().toISOString();
      }
      return success;
    } catch (error) {
      console.error("Database connection test failed:", error);
      if (this.config) {
        this.config.connectionStatus = "error";
      }
      return false;
    }
  }

  async switchDatabase(newConfig: DatabaseConfig): Promise<boolean> {
    // Backup current data if needed
    if (this.currentProvider && this.config) {
      try {
        const backup = await this.currentProvider.backup(this.config.config);
        // Store backup temporarily
        console.log("Database backup created before switching");
      } catch (error) {
        console.warn("Failed to create backup:", error);
      }
    }

    // Disconnect current provider
    if (this.currentProvider) {
      await this.currentProvider.disconnect();
    }

    // Initialize new provider
    return await this.initialize(newConfig);
  }

  // Proxy methods to current provider
  async create(collection: string, data: any): Promise<any> {
    if (!this.currentProvider) throw new Error("Database not initialized");
    return await this.currentProvider.create(collection, data);
  }

  async read(collection: string, id?: string): Promise<any> {
    if (!this.currentProvider) throw new Error("Database not initialized");
    return await this.currentProvider.read(collection, id);
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    if (!this.currentProvider) throw new Error("Database not initialized");
    return await this.currentProvider.update(collection, id, data);
  }

  async delete(collection: string, id: string): Promise<boolean> {
    if (!this.currentProvider) throw new Error("Database not initialized");
    return await this.currentProvider.delete(collection, id);
  }

  async query(collection: string, filters: any): Promise<any[]> {
    if (!this.currentProvider) throw new Error("Database not initialized");
    return await this.currentProvider.query(collection, filters);
  }

  async count(collection: string, filters?: any): Promise<number> {
    if (!this.currentProvider) throw new Error("Database not initialized");
    return await this.currentProvider.count(collection, filters);
  }

  getCurrentConfig(): DatabaseConfig | null {
    return this.config;
  }

  isConnected(): boolean {
    return this.config?.connectionStatus === "connected";
  }
}

// Global database manager instance
export const databaseManager = new DatabaseManager();

// Default configurations for each database type
export const defaultConfigs: Record<DatabaseType, any> = {
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },
  supabase: {
    url: "",
    anonKey: "",
    serviceKey: "",
  },
  mongodb: {
    connectionString: "",
    database: "",
    username: "",
    password: "",
  },
};

// Database providers are dynamically imported to avoid client-side issues
