import { DatabaseProvider } from '../index';

export class SupabaseDatabase implements DatabaseProvider {
  private config: any;
  private client: any = null;

  constructor(config: any) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      try {
        const { createClient } = await import('@supabase/supabase-js');

        this.client = createClient(
          this.config.url,
          this.config.anonKey || this.config.serviceKey
        );

        return true;
      } catch (importError) {
        console.warn('Supabase package not installed. Install with: npm install @supabase/supabase-js');
        return false;
      }
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    // Supabase client doesn't need explicit disconnection
    this.client = null;
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.client) return false;
      
      // Test connection by attempting to read from auth
      const { data, error } = await this.client.auth.getSession();
      
      // Even if no session, if no error occurred, connection is working
      return !error || error.message !== 'Network request failed';
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  async create(collection: string, data: any): Promise<any> {
    try {
      const newData = {
        ...data,
        created_at: data.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Remove undefined fields
      Object.keys(newData).forEach(key => {
        if (newData[key] === undefined) {
          delete newData[key];
        }
      });
      
      const { data: result, error } = await this.client
        .from(collection)
        .insert([newData])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase create error:', error);
        throw new Error(`Supabase create failed: ${error.message}`);
      }
      
      return result;
    } catch (error) {
      console.error('Supabase create failed:', error);
      throw error;
    }
  }

  async read(collection: string, id?: string): Promise<any> {
    try {
      if (id) {
        const { data, error } = await this.client
          .from(collection)
          .select('*')
          .eq('id', id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw new Error(`Supabase read failed: ${error.message}`);
        }
        
        return data || null;
      } else {
        const { data, error } = await this.client
          .from(collection)
          .select('*');
        
        if (error) {
          throw new Error(`Supabase read failed: ${error.message}`);
        }
        
        return { [collection]: data || [] };
      }
    } catch (error) {
      console.error('Supabase read failed:', error);
      throw error;
    }
  }

  async update(collection: string, id: string, data: any): Promise<any> {
    try {
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // Remove undefined fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });
      
      const { data: result, error } = await this.client
        .from(collection)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw new Error(`Supabase update failed: ${error.message}`);
      }
      
      return result;
    } catch (error) {
      console.error('Supabase update failed:', error);
      throw error;
    }
  }

  async delete(collection: string, id: string): Promise<boolean> {
    try {
      const { error } = await this.client
        .from(collection)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Supabase delete failed:', error);
      return false;
    }
  }

  async query(collection: string, filters: any): Promise<any[]> {
    try {
      let query = this.client.from(collection).select('*');
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          if (value !== undefined && value !== null) {
            if (key === '_orderBy') {
              const { field, direction = 'asc' } = value;
              query = query.order(field, { ascending: direction === 'asc' });
            } else if (key === '_limit') {
              query = query.limit(value);
            } else if (key === '_range') {
              const { from, to } = value;
              query = query.range(from, to);
            } else if (typeof value === 'string' && value.includes('%')) {
              // LIKE query for partial matches
              query = query.ilike(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Supabase query failed: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Supabase query failed:', error);
      throw error;
    }
  }

  async count(collection: string, filters?: any): Promise<number> {
    try {
      let query = this.client.from(collection).select('*', { count: 'exact', head: true });
      
      if (filters) {
        Object.keys(filters).forEach(key => {
          const value = filters[key];
          if (value !== undefined && value !== null && key !== '_orderBy' && key !== '_limit' && key !== '_range') {
            if (typeof value === 'string' && value.includes('%')) {
              query = query.ilike(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }
      
      const { count, error } = await query;
      
      if (error) {
        throw new Error(`Supabase count failed: ${error.message}`);
      }
      
      return count || 0;
    } catch (error) {
      console.error('Supabase count failed:', error);
      return 0;
    }
  }

  async backup(): Promise<any> {
    try {
      // Get all tables (this is a simplified version)
      const tables = ['services', 'bookings', 'customers', 'users', 'messages', 'notifications'];
      const backup: any = {};
      
      for (const table of tables) {
        try {
          const data = await this.read(table);
          backup[table] = data[table];
        } catch (error) {
          console.warn(`Failed to backup table ${table}:`, error);
          backup[table] = [];
        }
      }
      
      return backup;
    } catch (error) {
      console.error('Supabase backup failed:', error);
      throw error;
    }
  }

  async restore(data: any): Promise<boolean> {
    try {
      for (const [tableName, tableData] of Object.entries(data)) {
        if (Array.isArray(tableData) && tableData.length > 0) {
          // Clear existing data first (optional)
          // await this.client.from(tableName).delete().neq('id', '');
          
          // Insert new data
          const { error } = await this.client
            .from(tableName)
            .insert(tableData);
          
          if (error) {
            console.error(`Failed to restore table ${tableName}:`, error);
            return false;
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Supabase restore failed:', error);
      return false;
    }
  }
}
