import fs from 'fs/promises';
import path from 'path';

export class DataManager {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'data');
  }

  private getFilePath(filename: string): string {
    return path.join(this.dataDir, `${filename}.json`);
  }

  async readData<T = any>(filename: string): Promise<T | null> {
    try {
      const filePath = this.getFilePath(filename);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return null;
    }
  }

  async writeData<T = any>(filename: string, data: T): Promise<boolean> {
    try {
      const filePath = this.getFilePath(filename);
      
      // Ensure directory exists
      await fs.mkdir(this.dataDir, { recursive: true });
      
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  async updateData<T = any>(filename: string, updateFn: (data: T) => T): Promise<T | null> {
    try {
      const currentData = await this.readData<T>(filename);
      if (!currentData) {
        throw new Error(`File ${filename} not found`);
      }

      const updatedData = updateFn(currentData);
      const success = await this.writeData(filename, updatedData);
      
      if (success) {
        return updatedData;
      }
      return null;
    } catch (error) {
      console.error(`Error updating ${filename}:`, error);
      return null;
    }
  }

  async appendToArray<T = any>(filename: string, arrayKey: string, newItem: T): Promise<boolean> {
    try {
      const data = await this.readData<any>(filename);
      if (!data || !Array.isArray(data[arrayKey])) {
        throw new Error(`Array ${arrayKey} not found in ${filename}`);
      }

      data[arrayKey].push(newItem);
      data.metadata = {
        ...data.metadata,
        total: data[arrayKey].length,
        lastUpdated: new Date().toISOString()
      };

      return await this.writeData(filename, data);
    } catch (error) {
      console.error(`Error appending to ${filename}:`, error);
      return false;
    }
  }

  async updateArrayItem<
    T extends { id: string } = Record<string, any> & { id: string }
  >(
    filename: string, 
    arrayKey: string, 
    itemId: string, 
    updates: Partial<T>
  ): Promise<T | null> {
    try {
      const data = await this.readData<any>(filename);
      if (!data || !Array.isArray(data[arrayKey])) {
        throw new Error(`Array ${arrayKey} not found in ${filename}`);
      }

      const itemIndex = data[arrayKey].findIndex((item: T) => item.id === itemId);
      if (itemIndex === -1) {
        throw new Error(`Item with id ${itemId} not found`);
      }

      data[arrayKey][itemIndex] = {
        ...data[arrayKey][itemIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      data.metadata = {
        ...data.metadata,
        lastUpdated: new Date().toISOString()
      };

      const success = await this.writeData(filename, data);
      return success ? data[arrayKey][itemIndex] : null;
    } catch (error) {
      console.error(`Error updating item in ${filename}:`, error);
      return null;
    }
  }

  async deleteArrayItem(filename: string, arrayKey: string, itemId: string): Promise<boolean> {
    try {
      const data = await this.readData<any>(filename);
      if (!data || !Array.isArray(data[arrayKey])) {
        throw new Error(`Array ${arrayKey} not found in ${filename}`);
      }

      const initialLength = data[arrayKey].length;
      data[arrayKey] = data[arrayKey].filter((item: any) => item.id !== itemId);

      if (data[arrayKey].length === initialLength) {
        throw new Error(`Item with id ${itemId} not found`);
      }

      data.metadata = {
        ...data.metadata,
        total: data[arrayKey].length,
        lastUpdated: new Date().toISOString()
      };

      return await this.writeData(filename, data);
    } catch (error) {
      console.error(`Error deleting item from ${filename}:`, error);
      return false;
    }
  }

  async findArrayItem<T extends { id: string } = { id: string }>(
    filename: string, 
    arrayKey: string, 
    itemId: string
  ): Promise<T | null> {
    try {
      const data = await this.readData<any>(filename);
      if (!data || !Array.isArray(data[arrayKey])) {
        return null;
      }

      return data[arrayKey].find((item: T) => item.id === itemId) || null;
    } catch (error) {
      console.error(`Error finding item in ${filename}:`, error);
      return null;
    }
  }

  generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export const dataManager = new DataManager();
