import { DatabaseProvider } from "../index";

// Client-safe JSON database provider
export class JsonDatabase implements DatabaseProvider {
  private config: any;
  private dataPath: string;
  private backupPath: string;
  private isServer: boolean;

  constructor(config: any) {
    this.config = config;
    this.dataPath = config.dataPath || "./data";
    this.backupPath = config.backupPath || "./backups";
    this.isServer = typeof window === "undefined";
  }

  async connect(): Promise<boolean> {
    if (!this.isServer) {
      console.warn("JSON Database is only available on the server side");
      return false;
    }

    try {
      // Dynamically import fs only on server side
      const fs = await import("fs/promises");
      await fs.mkdir(this.dataPath, { recursive: true });
      await fs.mkdir(this.backupPath, { recursive: true });
      return true;
    } catch (error) {
      console.error("JSON Database connection failed:", error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    // JSON database doesn't need explicit disconnection
  }

  async testConnection(): Promise<boolean> {
    if (!this.isServer) {
      return false;
    }

    try {
      const fs = await import("fs/promises");
      await fs.access(this.dataPath);
      return true;
    } catch {
      return false;
    }
  }

  private getFilePath(collection: string): string {
    const path = require("path");
    return path.join(this.dataPath, `${collection}.json`);
  }

  private async readFile(collection: string): Promise<any> {
    if (!this.isServer) {
      throw new Error("JSON Database is only available on the server side");
    }

    try {
      const fs = await import("fs/promises");
      const filePath = this.getFilePath(collection);
      const data = await fs.readFile(filePath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // Return empty structure if file doesn't exist
      return { [collection]: [] };
    }
  }

  private async writeFile(collection: string, data: any): Promise<void> {
    if (!this.isServer) {
      throw new Error("JSON Database is only available on the server side");
    }

    const fs = await import("fs/promises");
    const filePath = this.getFilePath(collection);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    // Auto backup if enabled
    if (this.config.autoBackup) {
      await this.createBackup(collection, data);
    }
  }

  private async createBackup(collection: string, data: any): Promise<void> {
    if (!this.isServer) return;

    try {
      const fs = await import("fs/promises");
      const path = require("path");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFile = path.join(
        this.backupPath,
        `${collection}_${timestamp}.json`,
      );
      await fs.writeFile(backupFile, JSON.stringify(data, null, 2), "utf8");

      // Clean old backups
      await this.cleanOldBackups(collection);
    } catch (error) {
      console.warn("Backup creation failed:", error);
    }
  }

  private async cleanOldBackups(collection: string): Promise<void> {
    if (!this.isServer) return;

    try {
      const fs = await import("fs/promises");
      const path = require("path");
      const files = await fs.readdir(this.backupPath);
      const backupFiles = files
        .filter(
          (file) => file.startsWith(`${collection}_`) && file.endsWith(".json"),
        )
        .map((file) => ({
          name: file,
          path: path.join(this.backupPath, file),
          time: fs
            .stat(path.join(this.backupPath, file))
            .then((stats) => stats.mtime),
        }));

      if (backupFiles.length > (this.config.maxBackups || 10)) {
        const sortedFiles = await Promise.all(
          backupFiles.map(async (file) => ({
            ...file,
            time: await file.time,
          })),
        );

        sortedFiles.sort((a, b) => b.time.getTime() - a.time.getTime());

        // Delete old backups
        for (
          let i = this.config.maxBackups || 10;
          i < sortedFiles.length;
          i++
        ) {
          await fs.unlink(sortedFiles[i].path);
        }
      }
    } catch (error) {
      console.warn("Backup cleanup failed:", error);
    }
  }

  async create(collection: string, data: any): Promise<any> {
    const fileData = await this.readFile(collection);
    const items = fileData[collection] || [];

    const newItem = {
      ...data,
      id:
        data.id ||
        `${collection}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    items.push(newItem);
    fileData[collection] = items;

    await this.writeFile(collection, fileData);
    return newItem;
  }

  async read(collection: string, id?: string): Promise<any> {
    const fileData = await this.readFile(collection);
    const items = fileData[collection] || [];

    if (id) {
      return items.find((item: any) => item.id === id) || null;
    }

    return fileData;
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    const fileData = await this.readFile(collection);
    const items = fileData[collection] || [];

    const index = items.findIndex((item: any) => item.id === id);
    if (index === -1) {
      throw new Error(
        `Item with id ${id} not found in collection ${collection}`,
      );
    }

    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    fileData[collection] = items;
    await this.writeFile(collection, fileData);

    return items[index];
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const fileData = await this.readFile(collection);
    const items = fileData[collection] || [];

    const originalLength = items.length;
    fileData[collection] = items.filter((item: any) => item.id !== id);

    if (fileData[collection].length === originalLength) {
      return false; // Item not found
    }

    await this.writeFile(collection, fileData);
    return true;
  }

  async query(collection: string, filters: any): Promise<any[]> {
    const fileData = await this.readFile(collection);
    let items = fileData[collection] || [];

    // Apply filters
    if (filters) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value !== undefined && value !== null) {
          items = items.filter((item: any) => {
            if (typeof value === "string" && typeof item[key] === "string") {
              return item[key].toLowerCase().includes(value.toLowerCase());
            }
            return item[key] === value;
          });
        }
      });
    }

    return items;
  }

  async count(collection: string, filters?: any): Promise<number> {
    const items = await this.query(collection, filters);
    return items.length;
  }

  async backup(): Promise<any> {
    if (!this.isServer) {
      throw new Error("JSON Database is only available on the server side");
    }

    try {
      const fs = await import("fs/promises");
      const backup: any = {};
      const files = await fs.readdir(this.dataPath);

      for (const file of files) {
        if (file.endsWith(".json")) {
          const collection = file.replace(".json", "");
          backup[collection] = await this.readFile(collection);
        }
      }

      return backup;
    } catch (error) {
      console.error("Backup failed:", error);
      throw error;
    }
  }

  async restore(data: any): Promise<boolean> {
    try {
      for (const [collection, collectionData] of Object.entries(data)) {
        await this.writeFile(collection, collectionData);
      }
      return true;
    } catch (error) {
      console.error("Restore failed:", error);
      return false;
    }
  }

  async getDatabaseStatus(config: any): Promise<{ isEmpty: boolean; hasIncompatibleSchema: boolean; hasOldSchema: boolean; }> {
    return { isEmpty: true, hasIncompatibleSchema: false, hasOldSchema: false };
  }
  async createTable(config: any, table: any): Promise<void> {
    // Not applicable for JSON database
  }
  async createIndex(config: any, index: any): Promise<void> {
    // Not applicable for JSON database
  }
  async createRelation(config: any, relation: any): Promise<void> {
    // Not applicable for JSON database
  }
  async insertBatch(config: any, tableName: string, records: any[]): Promise<void> {
    const fileData = await this.readFile(tableName);
    const items = fileData[tableName] || [];
    items.push(...records);
    fileData[tableName] = items;
    await this.writeFile(tableName, fileData);
  }
  async truncateTable(config: any, tableName: string): Promise<void> {
    await this.writeFile(tableName, { [tableName]: [] });
  }
  async findAll(config: any, tableName: string, filters?: any): Promise<any[]> {
    return this.query(tableName, filters);
  }
}
