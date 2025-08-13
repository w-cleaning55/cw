import { DatabaseProvider } from '../index';

export class MongoDatabase implements DatabaseProvider {
  private config: any;
  private client: any = null;
  private db: any = null;

  constructor(config: any) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      try {
        const { MongoClient } = await import('mongodb');

        const connectionString = this.config.connectionString ||
          `mongodb://${this.config.username}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.database}`;

        this.client = new MongoClient(connectionString, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        await this.client.connect();
        this.db = this.client.db(this.config.database);

        return true;
      } catch (importError) {
        console.warn('MongoDB package not installed. Install with: npm install mongodb');
        return false;
      }
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
      }
    } catch (error) {
      console.error('MongoDB disconnect failed:', error);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.db) return false;
      
      // Test connection by pinging the database
      await this.db.admin().ping();
      return true;
    } catch (error) {
      console.error('MongoDB connection test failed:', error);
      return false;
    }
  }

  async create(collection: string, data: any): Promise<any> {
    try {
      const { ObjectId } = await import('mongodb');
      
      const newData = {
        ...data,
        _id: data.id ? data.id : new ObjectId(),
        createdAt: data.createdAt || new Date(),
        updatedAt: new Date()
      };
      
      const result = await this.db.collection(collection).insertOne(newData);
      
      return {
        id: result.insertedId.toString(),
        ...newData,
        _id: result.insertedId
      };
    } catch (error) {
      console.error('MongoDB create failed:', error);
      throw error;
    }
  }

  async read(collection: string, id?: string): Promise<any> {
    try {
      if (id) {
        const { ObjectId } = await import('mongodb');
        
        let query: any = {};
        
        // Try to find by custom id first, then by ObjectId
        if (ObjectId.isValid(id)) {
          query = { $or: [{ id: id }, { _id: new ObjectId(id) }] };
        } else {
          query = { id: id };
        }
        
        const document = await this.db.collection(collection).findOne(query);
        
        if (document) {
          return {
            id: document.id || document._id.toString(),
            ...document,
            _id: document._id
          };
        }
        
        return null;
      } else {
        const documents = await this.db.collection(collection).find({}).toArray();
        
        const results: any = {};
        results[collection] = documents.map((doc: any) => ({
          id: doc.id || doc._id.toString(),
          ...doc,
          _id: doc._id
        }));
        
        return results;
      }
    } catch (error) {
      console.error('MongoDB read failed:', error);
      throw error;
    }
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    try {
      const { ObjectId } = await import('mongodb');
      
      let query: any = {};
      
      // Try to find by custom id first, then by ObjectId
      if (ObjectId.isValid(id)) {
        query = { $or: [{ id: id }, { _id: new ObjectId(id) }] };
      } else {
        query = { id: id };
      }
      
      const updateData = {
        ...data,
        updatedAt: new Date()
      };
      
      // Remove undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      const result = await this.db.collection(collection).findOneAndUpdate(
        query,
        { $set: updateData },
        { returnDocument: 'after' }
      );
      
      if (!result.value) {
        throw new Error(`Document with id ${id} not found in collection ${collection}`);
      }
      
      return {
        id: result.value.id || result.value._id.toString(),
        ...result.value,
        _id: result.value._id
      };
    } catch (error) {
      console.error('MongoDB update failed:', error);
      throw error;
    }
  }

  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const { ObjectId } = await import('mongodb');
      
      let query: any = {};
      
      // Try to find by custom id first, then by ObjectId
      if (ObjectId.isValid(id)) {
        query = { $or: [{ id: id }, { _id: new ObjectId(id) }] };
      } else {
        query = { id: id };
      }
      
      const result = await this.db.collection(collection).deleteOne(query);
      
      return result.deletedCount > 0;
    } catch (error) {
      console.error('MongoDB delete failed:', error);
      return false;
    }
  }

  async query(collection: string, filters: any): Promise<any[]> {
    try {
      let query: any = {};
      let options: any = {};
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          if (value !== undefined && value !== null) {
            if (key === '_orderBy') {
              const { field, direction = 'asc' } = value;
              options.sort = { [field]: direction === 'asc' ? 1 : -1 };
            } else if (key === '_limit') {
              options.limit = value;
            } else if (key === '_skip') {
              options.skip = value;
            } else if (typeof value === 'string' && value.includes('*')) {
              // Regex query for partial matches
              query[key] = new RegExp(value.replace(/\*/g, '.*'), 'i');
            } else if (typeof value === 'object' && value.hasOwnProperty('$')) {
              // MongoDB operators
              query[key] = value;
            } else {
              query[key] = value;
            }
          }
        });
      }
      
      const documents = await this.db.collection(collection)
        .find(query, options)
        .toArray();
      
      return documents.map((doc: any) => ({
        id: doc.id || doc._id.toString(),
        ...doc,
        _id: doc._id
      }));
    } catch (error) {
      console.error('MongoDB query failed:', error);
      throw error;
    }
  }

  async count(collection: string, filters?: any): Promise<number> {
    try {
      let query: any = {};
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          if (value !== undefined && value !== null && 
              key !== '_orderBy' && key !== '_limit' && key !== '_skip') {
            if (typeof value === 'string' && value.includes('*')) {
              query[key] = new RegExp(value.replace(/\*/g, '.*'), 'i');
            } else if (typeof value === 'object' && value.hasOwnProperty('$')) {
              query[key] = value;
            } else {
              query[key] = value;
            }
          }
        });
      }
      
      const count = await this.db.collection(collection).countDocuments(query);
      return count;
    } catch (error) {
      console.error('MongoDB count failed:', error);
      return 0;
    }
  }

  async backup(): Promise<any> {
    try {
      // Get all collections
      const collections = await this.db.listCollections().toArray();
      const backup: any = {};
      
      for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;
        
        // Skip system collections
        if (!collectionName.startsWith('system.')) {
          const data = await this.read(collectionName);
          backup[collectionName] = data[collectionName];
        }
      }
      
      return backup;
    } catch (error) {
      console.error('MongoDB backup failed:', error);
      throw error;
    }
  }

  async restore(data: any): Promise<boolean> {
    try {
      for (const [collectionName, collectionData] of Object.entries(data)) {
        if (Array.isArray(collectionData) && collectionData.length > 0) {
          // Clear existing data first (optional)
          // await this.db.collection(collectionName).deleteMany({});
          
          // Insert new data
          await this.db.collection(collectionName).insertMany(collectionData);
        }
      }
      
      return true;
    } catch (error) {
      console.error('MongoDB restore failed:', error);
      return false;
    }
  }
}
