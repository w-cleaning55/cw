import { DatabaseProvider } from './index';

export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'supabase' | 'mongodb' | 'firebase' | 'json';
  config: Record<string, any>;
  isActive: boolean;
  isConnected: boolean;
  lastConnected?: string;
  metadata?: {
    version?: string;
    size?: number;
    tables?: string[];
    collections?: string[];
  };
}

export interface MigrationStep {
  id: string;
  name: string;
  type: 'create_table' | 'alter_table' | 'insert_data' | 'update_data' | 'custom';
  target: string;
  query?: string;
  data?: any;
  reversible: boolean;
  dependsOn?: string[];
}

export interface Migration {
  id: string;
  version: string;
  name: string;
  description: string;
  steps: MigrationStep[];
  applied: boolean;
  appliedAt?: string;
  rollbackSteps?: MigrationStep[];
}

export interface BackupMetadata {
  id: string;
  name: string;
  source: DatabaseConnection;
  createdAt: string;
  size: number;
  format: 'json' | 'sql' | 'binary';
  compressed: boolean;
  tables: string[];
  recordCount: number;
  checksum: string;
}

export interface DataTransferJob {
  id: string;
  name: string;
  source: DatabaseConnection;
  target: DatabaseConnection;
  mapping: {
    [sourceTable: string]: {
      targetTable: string;
      fieldMapping: { [sourceField: string]: string };
      transform?: (data: any) => any;
    };
  };
  options: {
    batchSize: number;
    skipIfExists: boolean;
    truncateTarget: boolean;
    validateData: boolean;
  };
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: {
    totalTables: number;
    completedTables: number;
    currentTable?: string;
    totalRecords: number;
    transferredRecords: number;
    errors: Array<{
      table: string;
      record?: any;
      error: string;
      timestamp: string;
    }>;
  };
  startedAt?: string;
  completedAt?: string;
  estimatedCompletion?: string;
}

export class DatabaseManager {
  private connections: Map<string, DatabaseConnection> = new Map();
  private providers: Map<string, DatabaseProvider> = new Map();
  private migrations: Migration[] = [];
  private activeConnection: string | null = null;

  constructor() {
    this.loadConnections();
    this.loadMigrations();
  }

  // ============ إدارة الاتصالات ============

  async addConnection(connection: Omit<DatabaseConnection, 'id' | 'isConnected'>): Promise<string> {
    const id = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newConnection: DatabaseConnection = {
      ...connection,
      id,
      isConnected: false
    };

    this.connections.set(id, newConnection);
    await this.saveConnections();
    return id;
  }

  async testConnection(connectionId: string): Promise<{
    success: boolean;
    message: string;
    metadata?: any;
  }> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return { success: false, message: 'Connection not found' };
    }

    try {
      const provider = await this.getProvider(connection.type);
      const result = await provider.testConnection(connection.config);
      const success = typeof result === 'boolean' ? result : result.success;
      
      if (success) {
        // تحديث الميتاداتا
        connection.isConnected = true;
        connection.lastConnected = new Date().toISOString();
        if (typeof result !== 'boolean') {
          connection.metadata = result.metadata;
        }
        
        this.connections.set(connectionId, connection);
        await this.saveConnections();
      }

      return typeof result === 'boolean' ? { success: result, message: '' } : result;
    } catch (error: any) {
      return {
        success: false,
        message: `خطأ في الاتصال: ${error.message}`
      };
    }
  }

  async setActiveConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    if (!connection.isConnected) {
      const testResult = await this.testConnection(connectionId);
      if (!testResult.success) {
        throw new Error(`Cannot activate disconnected database: ${testResult.message}`);
      }
    }

    // إيقاف الاتصال النشط الحالي
    if (this.activeConnection) {
      const currentConnection = this.connections.get(this.activeConnection);
      if (currentConnection) {
        currentConnection.isActive = false;
        this.connections.set(this.activeConnection, currentConnection);
      }
    }

    // تفعيل الاتصال الجديد
    connection.isActive = true;
    this.connections.set(connectionId, connection);
    this.activeConnection = connectionId;

    await this.saveConnections();
    
    // بدء عملية الإعداد التلقائي
    await this.autoSetupDatabase(connectionId);
  }

  // ============ الإعداد التلقائي لقاعدة البيانات ============

  async autoSetupDatabase(connectionId: string): Promise<{
    setupRequired: boolean;
    actions: string[];
    backupRecommended: boolean;
    migrationRequired: boolean;
  }> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    const provider = await this.getProvider(connection.type);
    const actions: string[] = [];
    let setupRequired = false;
    let backupRecommended = false;
    let migrationRequired = false;

    try {
      // فحص حالة قاعدة البيانات
      const dbStatus = await provider.getDatabaseStatus(connection.config);
      
      if (dbStatus.isEmpty) {
        // قاعدة البيانات فارغة - إنشاء المخطط
        setupRequired = true;
        actions.push('إنشاء مخطط قاعدة البيانات');
        actions.push('إدراج البيانات الافتراضية');
        
        await this.createDatabaseSchema(connectionId);
        await this.seedDefaultData(connectionId);
        
      } else if (dbStatus.hasIncompatibleSchema) {
        // المخطط غير متوافق - هجرة مطلوبة
        migrationRequired = true;
        backupRecommended = true;
        actions.push('إنشاء نسخة احتياطية');
        actions.push('هجرة المخطط');
        actions.push('نقل البيانات');
        
      } else if (dbStatus.hasOldSchema) {
        // المخطط قديم - تحديث مطلوب
        migrationRequired = true;
        backupRecommended = true;
        actions.push('إنشاء نسخة احتياطية');
        actions.push('تحديث المخطط');
        
      } else {
        // قاعدة البيانات جاهزة
        actions.push('قاعدة البيانات جاهزة للاستخدام');
      }

      // نقل البيانات من النظام الحالي إذا لزم الأمر
      if (setupRequired) {
        await this.migrateFromCurrentSystem(connectionId);
        actions.push('نقل البيانات من النظام الحالي');
      }

      return {
        setupRequired,
        actions,
        backupRecommended,
        migrationRequired
      };

    } catch (error: any) {
      throw new Error(`فشل في إعداد قاعدة البيانات: ${error.message}`);
    }
  }

  // ============ إنشاء المخطط ============

  async createDatabaseSchema(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    const provider = await this.getProvider(connection.type);
    
    // مخطط النظام الأساسي
    const schema = this.getSystemSchema();
    
    for (const table of schema.tables) {
      await provider.createTable(connection.config, table);
    }

    // إنشاء الفهارس
    for (const index of schema.indexes) {
      await provider.createIndex(connection.config, index);
    }

    // إعداد العلاقات
    for (const relation of schema.relations) {
      await provider.createRelation(connection.config, relation);
    }
  }

  private getSystemSchema() {
    return {
      tables: [
        {
          name: 'services',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'name', type: 'varchar', required: true },
            { name: 'nameAr', type: 'varchar', required: true },
            { name: 'description', type: 'text' },
            { name: 'descriptionAr', type: 'text' },
            { name: 'price', type: 'decimal', required: true },
            { name: 'duration', type: 'integer' },
            { name: 'category', type: 'varchar' },
            { name: 'isActive', type: 'boolean', default: true },
            { name: 'imageUrl', type: 'varchar' },
            { name: 'features', type: 'json' },
            { name: 'createdAt', type: 'timestamp', default: 'now()' },
            { name: 'updatedAt', type: 'timestamp', default: 'now()' }
          ]
        },
        {
          name: 'customers',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'name', type: 'varchar', required: true },
            { name: 'email', type: 'varchar', unique: true },
            { name: 'phone', type: 'varchar', required: true },
            { name: 'address', type: 'text' },
            { name: 'district', type: 'varchar' },
            { name: 'city', type: 'varchar', default: 'جدة' },
            { name: 'coordinates', type: 'json' },
            { name: 'preferences', type: 'json' },
            { name: 'isActive', type: 'boolean', default: true },
            { name: 'totalBookings', type: 'integer', default: 0 },
            { name: 'totalSpent', type: 'decimal', default: 0 },
            { name: 'rating', type: 'decimal' },
            { name: 'createdAt', type: 'timestamp', default: 'now()' },
            { name: 'updatedAt', type: 'timestamp', default: 'now()' }
          ]
        },
        {
          name: 'bookings',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'customerId', type: 'varchar', required: true },
            { name: 'serviceId', type: 'varchar', required: true },
            { name: 'status', type: 'varchar', required: true },
            { name: 'scheduledDate', type: 'date', required: true },
            { name: 'scheduledTime', type: 'time', required: true },
            { name: 'duration', type: 'integer' },
            { name: 'price', type: 'decimal', required: true },
            { name: 'address', type: 'text', required: true },
            { name: 'district', type: 'varchar' },
            { name: 'coordinates', type: 'json' },
            { name: 'notes', type: 'text' },
            { name: 'specialRequests', type: 'text' },
            { name: 'assignedTo', type: 'varchar' },
            { name: 'completedAt', type: 'timestamp' },
            { name: 'rating', type: 'integer' },
            { name: 'review', type: 'text' },
            { name: 'paymentStatus', type: 'varchar', default: 'pending' },
            { name: 'paymentMethod', type: 'varchar' },
            { name: 'createdAt', type: 'timestamp', default: 'now()' },
            { name: 'updatedAt', type: 'timestamp', default: 'now()' }
          ]
        },
        {
          name: 'users',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'email', type: 'varchar', unique: true, required: true },
            { name: 'username', type: 'varchar', unique: true, required: true },
            { name: 'passwordHash', type: 'varchar', required: true },
            { name: 'name', type: 'varchar', required: true },
            { name: 'role', type: 'varchar', required: true },
            { name: 'permissions', type: 'json' },
            { name: 'isActive', type: 'boolean', default: true },
            { name: 'lastLoginAt', type: 'timestamp' },
            { name: 'preferences', type: 'json' },
            { name: 'createdAt', type: 'timestamp', default: 'now()' },
            { name: 'updatedAt', type: 'timestamp', default: 'now()' }
          ]
        },
        {
          name: 'messages',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'customerId', type: 'varchar' },
            { name: 'senderName', type: 'varchar', required: true },
            { name: 'senderEmail', type: 'varchar', required: true },
            { name: 'senderPhone', type: 'varchar' },
            { name: 'subject', type: 'varchar', required: true },
            { name: 'message', type: 'text', required: true },
            { name: 'serviceType', type: 'varchar' },
            { name: 'priority', type: 'varchar', default: 'medium' },
            { name: 'status', type: 'varchar', default: 'unread' },
            { name: 'assignedTo', type: 'varchar' },
            { name: 'response', type: 'text' },
            { name: 'respondedAt', type: 'timestamp' },
            { name: 'respondedBy', type: 'varchar' },
            { name: 'source', type: 'varchar', default: 'contact_form' },
            { name: 'createdAt', type: 'timestamp', default: 'now()' },
            { name: 'updatedAt', type: 'timestamp', default: 'now()' }
          ]
        },
        {
          name: 'notifications',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'type', type: 'varchar', required: true },
            { name: 'title', type: 'varchar', required: true },
            { name: 'titleAr', type: 'varchar', required: true },
            { name: 'message', type: 'text', required: true },
            { name: 'messageAr', type: 'text', required: true },
            { name: 'userId', type: 'varchar' },
            { name: 'isRead', type: 'boolean', default: false },
            { name: 'priority', type: 'varchar', default: 'medium' },
            { name: 'category', type: 'varchar' },
            { name: 'categoryAr', type: 'varchar' },
            { name: 'data', type: 'json' },
            { name: 'channels', type: 'json' },
            { name: 'sentAt', type: 'timestamp' },
            { name: 'readAt', type: 'timestamp' },
            { name: 'createdAt', type: 'timestamp', default: 'now()' }
          ]
        },
        {
          name: 'company_settings',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'key', type: 'varchar', unique: true, required: true },
            { name: 'value', type: 'json', required: true },
            { name: 'category', type: 'varchar' },
            { name: 'description', type: 'text' },
            { name: 'isPublic', type: 'boolean', default: false },
            { name: 'updatedBy', type: 'varchar' },
            { name: 'createdAt', type: 'timestamp', default: 'now()' },
            { name: 'updatedAt', type: 'timestamp', default: 'now()' }
          ]
        }
      ],
      indexes: [
        { table: 'bookings', columns: ['customerId'] },
        { table: 'bookings', columns: ['serviceId'] },
        { table: 'bookings', columns: ['status'] },
        { table: 'bookings', columns: ['scheduledDate'] },
        { table: 'messages', columns: ['customerId'] },
        { table: 'messages', columns: ['status'] },
        { table: 'messages', columns: ['priority'] },
        { table: 'notifications', columns: ['userId'] },
        { table: 'notifications', columns: ['isRead'] },
        { table: 'notifications', columns: ['type'] },
        { table: 'company_settings', columns: ['key'] },
        { table: 'company_settings', columns: ['category'] }
      ],
      relations: [
        {
          table: 'bookings',
          column: 'customerId',
          references: { table: 'customers', column: 'id' },
          onDelete: 'cascade'
        },
        {
          table: 'bookings',
          column: 'serviceId',
          references: { table: 'services', column: 'id' },
          onDelete: 'cascade'
        },
        {
          table: 'messages',
          column: 'customerId',
          references: { table: 'customers', column: 'id' },
          onDelete: 'set null'
        }
      ]
    };
  }

  // ============ إدراج البيانات الافتراضية ============

  async seedDefaultData(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    const provider = await this.getProvider(connection.type);
    
    // تحميل البيانات الافتراضية من ملفات JSON
    const defaultData = await this.loadDefaultData();
    
    for (const [tableName, records] of Object.entries(defaultData)) {
      if (Array.isArray(records) && records.length > 0) {
        await provider.insertBatch(connection.config, tableName, records);
      }
    }
  }

  private async loadDefaultData(): Promise<Record<string, any[]>> {
    try {
      // قراءة ملفات البيانات الافتراضية
      const dataFiles = [
        'services', 'customers', 'bookings', 'users', 
        'messages', 'notifications', 'company-settings'
      ];
      
      const data: Record<string, any[]> = {};
      
      for (const file of dataFiles) {
        try {
          const response = await fetch(`/data/${file}.json`);
          if (response.ok) {
            const fileData = await response.json();
            const tableName = file.replace('-', '_');
            data[tableName] = Array.isArray(fileData) ? fileData : [fileData];
          }
        } catch (error) {
          console.warn(`تعذر تحميل ملف البيانات: ${file}.json`);
        }
      }
      
      return data;
    } catch (error) {
      console.error('خطأ في تحميل البيانات الافتراضية:', error);
      return {};
    }
  }

  // ============ نقل البيانات من النظام الحالي ============

  async migrateFromCurrentSystem(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    // إذا كان النظام يعمل على JSON، نقل البيانات
    const currentProvider = await this.getProvider('json');
    const targetProvider = await this.getProvider(connection.type);
    
    try {
      // قائمة الجداول للنقل
      const tables = ['services', 'customers', 'bookings', 'users', 'messages', 'notifications'];
      
      for (const table of tables) {
        try {
          const data = await currentProvider.findAll({}, table);
          if (data && data.length > 0) {
            await targetProvider.insertBatch(connection.config, table, data);
          }
        } catch (error) {
          console.warn(`تعذر نقل بيانات الجدول: ${table}`, error);
        }
      }
    } catch (error) {
      console.error('خطأ في نقل البيانات:', error);
    }
  }

  // ============ إدارة النسخ الاحتياطي ============

  async createBackup(connectionId: string, options: {
    name?: string;
    includeTables?: string[];
    excludeTables?: string[];
    compressed?: boolean;
  } = {}): Promise<BackupMetadata> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    const provider = await this.getProvider(connection.type);
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const backup: BackupMetadata = {
      id: backupId,
      name: options.name || `نسخة احتياطية ${new Date().toLocaleString('ar')}`,
      source: connection,
      createdAt: new Date().toISOString(),
      size: 0,
      format: 'json',
      compressed: options.compressed || false,
      tables: [],
      recordCount: 0,
      checksum: ''
    };

    try {
      // إنشاء النسخة الاحتياطية
      const backupData = await provider.backup(connection.config, {
        includeTables: options.includeTables,
        excludeTables: options.excludeTables
      });

      // حفظ النسخة الاحتياطية
      const backupPath = `backups/${backupId}.json`;
      
      // في بيئة حقيقية، ستحفظ في نظام ملفات أو خدمة تخزين
      const backupJson = JSON.stringify(backupData, null, 2);
      backup.size = new Blob([backupJson]).size;
      backup.tables = Object.keys(backupData);
      backup.recordCount = Object.values(backupData).reduce((total: number, table: any) => 
        total + (Array.isArray(table) ? table.length : 0), 0
      );
      backup.checksum = await this.generateChecksum(backupJson);

      // حفظ معلومات النسخة الاحتياطية
      await this.saveBackupMetadata(backup);

      return backup;
    } catch (error: any) {
      throw new Error(`فشل في إنشاء النسخة الاحتياطية: ${error.message}`);
    }
  }

  async restoreBackup(backupId: string, targetConnectionId: string, options: {
    overwriteExisting?: boolean;
    includeTables?: string[];
    excludeTables?: string[];
  } = {}): Promise<void> {
    const backup = await this.getBackupMetadata(backupId);
    const connection = this.connections.get(targetConnectionId);
    
    if (!backup || !connection) {
      throw new Error('Backup or connection not found');
    }

    const provider = await this.getProvider(connection.type);

    try {
      // تحميل بيانات النسخة الاحتياطية
      const backupData = await this.loadBackupData(backupId);
      
      // التحقق من سلامة البيانات
      const dataJson = JSON.stringify(backupData);
      const checksum = await this.generateChecksum(dataJson);
      
      if (checksum !== backup.checksum) {
        throw new Error('البيانات المستعادة لا تطابق المجموع الاختباري');
      }

      // استعادة البيانات
      for (const [tableName, tableData] of Object.entries(backupData)) {
        if (options.includeTables && !options.includeTables.includes(tableName)) {
          continue;
        }
        if (options.excludeTables && options.excludeTables.includes(tableName)) {
          continue;
        }

        if (Array.isArray(tableData) && tableData.length > 0) {
          if (options.overwriteExisting) {
            await provider.truncateTable(connection.config, tableName);
          }
          await provider.insertBatch(connection.config, tableName, tableData);
        }
      }
    } catch (error: any) {
      throw new Error(`فشل في استعادة النسخة الاحتياطية: ${error.message}`);
    }
  }

  // ============ وظائف مساعدة ============

  private async getProvider(type: string): Promise<DatabaseProvider> {
    if (!this.providers.has(type)) {
      let provider: DatabaseProvider;
      switch (type) {
        case "firebase":
          const { FirebaseDatabase } = await import("./providers/firebase");
          provider = new FirebaseDatabase({});
          break;
        case "supabase":
          const { SupabaseDatabase } = await import("./providers/supabase");
          provider = new SupabaseDatabase({});
          break;
        case "mongodb":
          const { MongoDatabase } = await import("./providers/mongodb");
          provider = new MongoDatabase({});
          break;
        case "json":
          const { JsonDatabase } = await import("./providers/json");
          provider = new JsonDatabase({});
          break;
        default:
          throw new Error(`Unsupported database type: ${type}`);
      }
      this.providers.set(type, provider);
    }
    
    return this.providers.get(type)!;
  }

  private async generateChecksum(data: string): Promise<string> {
    // استخدام crypto API لإنشاء checksum
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async saveConnections(): Promise<void> {
    const connectionsData = Array.from(this.connections.values());
    if (typeof window !== 'undefined') {
      localStorage.setItem('database-connections', JSON.stringify(connectionsData));
    }
  }

  private loadConnections(): void {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('database-connections') : null;
    if (saved) {
      try {
        const connectionsData = JSON.parse(saved);
        this.connections.clear();
        
        connectionsData.forEach((conn: DatabaseConnection) => {
          this.connections.set(conn.id, conn);
          if (conn.isActive) {
            this.activeConnection = conn.id;
          }
        });
      } catch (error) {
        console.error('خطأ في تحميل اتصالات قاعدة البيانات:', error);
      }
    }
  }

  private async saveBackupMetadata(backup: BackupMetadata): Promise<void> {
    const backups = this.getBackups();
    backups.push(backup);
    if (typeof window !== 'undefined') {
      localStorage.setItem('database-backups', JSON.stringify(backups));
    }
  }

  private async getBackupMetadata(backupId: string): Promise<BackupMetadata | null> {
    const backups = this.getBackups();
    return backups.find(b => b.id === backupId) || null;
  }

  private getBackups(): BackupMetadata[] {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('database-backups') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('خطأ في تحميل النسخ الاحتياطية:', error);
      }
    }
    return [];
  }

  private async loadBackupData(backupId: string): Promise<any> {
    // في بيئة حقيقية، ستقرأ من نظام ملفات أو خدمة تخزين
    const backupPath = `backups/${backupId}.json`;
    // محاكاة تحميل البيانات
    return {};
  }

  private loadMigrations(): void {
    // تحميل الهجرات من الملفات أو قاعدة البيانات
    this.migrations = [];
  }

  // ============ واجهة برمجة التطبيقات العامة ============

  getConnections(): DatabaseConnection[] {
    return Array.from(this.connections.values());
  }

  getActiveConnection(): DatabaseConnection | null {
    return this.activeConnection ? this.connections.get(this.activeConnection) || null : null;
  }

  async deleteConnection(connectionId: string): Promise<void> {
    if (this.activeConnection === connectionId) {
      this.activeConnection = null;
    }
    this.connections.delete(connectionId);
    await this.saveConnections();
  }

  getBackupsList(): BackupMetadata[] {
    return this.getBackups();
  }

  async deleteBackup(backupId: string): Promise<void> {
    const backups = this.getBackups().filter(b => b.id !== backupId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('database-backups', JSON.stringify(backups));
    }
  }
}

// إنشاء مثيل مفرد
export const databaseManager = new DatabaseManager();
