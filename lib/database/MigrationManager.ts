import { DatabaseManager, Migration, MigrationStep } from './DatabaseManager';

export interface SchemaComparison {
  missingTables: string[];
  extraTables: string[];
  differentTables: {
    tableName: string;
    missingColumns: string[];
    extraColumns: string[];
    differentColumns: {
      columnName: string;
      currentType: string;
      expectedType: string;
    }[];
  }[];
  missingIndexes: string[];
  extraIndexes: string[];
  missingRelations: string[];
  extraRelations: string[];
}

export interface MigrationPlan {
  id: string;
  name: string;
  description: string;
  fromVersion: string;
  toVersion: string;
  migrations: Migration[];
  estimatedTime: number; // بالدقائق
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  backupRequired: boolean;
  reversible: boolean;
  warnings: string[];
  dependencies: string[];
}

export class MigrationManager {
  private dbManager: DatabaseManager;
  private migrations: Map<string, Migration> = new Map();
  private appliedMigrations: Set<string> = new Set();

  constructor(databaseManager: DatabaseManager) {
    this.dbManager = databaseManager;
    this.loadMigrations();
  }

  // ============ مقارنة المخططات ============

  async compareSchemas(connectionId: string): Promise<SchemaComparison> {
    const connection = this.dbManager.getConnections().find(c => c.id === connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    const provider = await this.getProvider(connection.type);
    const currentSchema = await provider.getSchema(connection.config);
    const expectedSchema = this.getExpectedSchema();

    return this.performSchemaComparison(currentSchema, expectedSchema);
  }

  private performSchemaComparison(current: any, expected: any): SchemaComparison {
    const comparison: SchemaComparison = {
      missingTables: [],
      extraTables: [],
      differentTables: [],
      missingIndexes: [],
      extraIndexes: [],
      missingRelations: [],
      extraRelations: []
    };

    // مقارنة الجداول
    const currentTables = new Set(current.tables.map((t: any) => t.name));
    const expectedTables = new Set(expected.tables.map((t: any) => t.name));

    // الجداول المفقودة
    for (const expectedTable of expected.tables) {
      if (!currentTables.has(expectedTable.name)) {
        comparison.missingTables.push(expectedTable.name);
      }
    }

    // الجداول الإضافية
    for (const currentTable of current.tables) {
      if (!expectedTables.has(currentTable.name)) {
        comparison.extraTables.push(currentTable.name);
      }
    }

    // مقارنة بنية الجداول الموجودة
    for (const expectedTable of expected.tables) {
      const currentTable = current.tables.find((t: any) => t.name === expectedTable.name);
      if (currentTable) {
        const tableDiff = this.compareTableStructure(currentTable, expectedTable);
        if (tableDiff.missingColumns.length > 0 || 
            tableDiff.extraColumns.length > 0 || 
            tableDiff.differentColumns.length > 0) {
          comparison.differentTables.push(tableDiff);
        }
      }
    }

    // مقارنة الفهارس
    const currentIndexes = new Set(current.indexes.map((i: any) => `${i.table}.${i.columns.join(',')}`));
    const expectedIndexes = new Set(expected.indexes.map((i: any) => `${i.table}.${i.columns.join(',')}`));

    for (const expectedIndex of expected.indexes) {
      const indexKey = `${expectedIndex.table}.${expectedIndex.columns.join(',')}`;
      if (!currentIndexes.has(indexKey)) {
        comparison.missingIndexes.push(indexKey);
      }
    }

    for (const currentIndex of current.indexes) {
      const indexKey = `${currentIndex.table}.${currentIndex.columns.join(',')}`;
      if (!expectedIndexes.has(indexKey)) {
        comparison.extraIndexes.push(indexKey);
      }
    }

    return comparison;
  }

  private compareTableStructure(current: any, expected: any) {
    const currentColumns = new Map(current.columns.map((c: any) => [c.name, c]));
    const expectedColumns = new Map(expected.columns.map((c: any) => [c.name, c]));

    const result = {
      tableName: expected.name,
      missingColumns: [] as string[],
      extraColumns: [] as string[],
      differentColumns: [] as any[]
    };

    // الأعمدة المفقودة
    for (const [name, column] of expectedColumns) {
      if (!currentColumns.has(name)) {
        result.missingColumns.push(name);
      }
    }

    // الأعمدة الإضافية
    for (const [name, column] of currentColumns) {
      if (!expectedColumns.has(name)) {
        result.extraColumns.push(name);
      }
    }

    // الأعمدة المختلفة
    for (const [name, expectedColumn] of expectedColumns) {
      const currentColumn = currentColumns.get(name);
      if (currentColumn && currentColumn.type !== expectedColumn.type) {
        result.differentColumns.push({
          columnName: name,
          currentType: currentColumn.type,
          expectedType: expectedColumn.type
        });
      }
    }

    return result;
  }

  // ============ إنشاء خطة الهجرة ============

  async createMigrationPlan(connectionId: string, targetVersion?: string): Promise<MigrationPlan> {
    const comparison = await this.compareSchemas(connectionId);
    const currentVersion = await this.getCurrentSchemaVersion(connectionId);
    const target = targetVersion || this.getLatestSchemaVersion();

    const planId = `migration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const migrations: Migration[] = [];
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let estimatedTime = 5; // دقائق أساسية

    // إنشاء هجرات للجداول المفقودة
    if (comparison.missingTables.length > 0) {
      migrations.push(this.createTableCreationMigration(comparison.missingTables));
      estimatedTime += comparison.missingTables.length * 2;
    }

    // إنشاء هجرات للأعمدة المفقودة
    if (comparison.differentTables.length > 0) {
      const schemaMigration = this.createSchemaUpdateMigration(comparison.differentTables);
      migrations.push(schemaMigration);
      estimatedTime += comparison.differentTables.length * 3;
      
      // فحص المخاطر
      for (const diff of comparison.differentTables) {
        if (diff.extraColumns.length > 0) {
          warnings.push(`سيتم حذف الأعمدة الإضافية في الجدول ${diff.tableName}`);
          riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
        }
        if (diff.differentColumns.length > 0) {
          warnings.push(`سيتم تغيير نوع البيانات في الجدول ${diff.tableName}`);
          riskLevel = riskLevel === 'low' ? 'high' : riskLevel;
        }
      }
    }

    // إنشاء هجرات للفهارس
    if (comparison.missingIndexes.length > 0) {
      migrations.push(this.createIndexCreationMigration(comparison.missingIndexes));
      estimatedTime += comparison.missingIndexes.length;
    }

    // إنشاء هجرات للعلاقات
    if (comparison.missingRelations.length > 0) {
      migrations.push(this.createRelationCreationMigration(comparison.missingRelations));
      estimatedTime += comparison.missingRelations.length;
    }

    // إنشاء هجرة لنقل البيانات إذا لزم الأمر
    if (await this.needsDataMigration(connectionId, currentVersion, target)) {
      const dataMigration = await this.createDataMigration(connectionId, currentVersion, target);
      migrations.push(dataMigration);
      estimatedTime += 10; // وقت إضافي لنقل البيانات
      riskLevel = 'high';
      warnings.push('سيتم نقل البيانات الموجودة - قد يستغرق وقتاً أطول');
    }

    const plan: MigrationPlan = {
      id: planId,
      name: `ترقية المخطط من ${currentVersion} إلى ${target}`,
      description: `هجرة قاعدة البيانات لتطبيق آخر التحديثات والتحسينات`,
      fromVersion: currentVersion,
      toVersion: target,
      migrations,
      estimatedTime,
      riskLevel,
      backupRequired: riskLevel !== 'low',
      reversible: riskLevel !== 'critical',
      warnings,
      dependencies: []
    };

    return plan;
  }

  // ============ تنفيذ الهجرة ============

  async executeMigrationPlan(
    connectionId: string, 
    planId: string,
    options: {
      createBackup?: boolean;
      dryRun?: boolean;
      continueOnError?: boolean;
    } = {}
  ): Promise<{
    success: boolean;
    executedSteps: string[];
    failedSteps: string[];
    backupId?: string;
    rollbackAvailable: boolean;
    errors: string[];
  }> {
    const plan = await this.getMigrationPlan(planId);
    if (!plan) {
      throw new Error('Migration plan not found');
    }

    const result = {
      success: false,
      executedSteps: [] as string[],
      failedSteps: [] as string[],
      backupId: undefined as string | undefined,
      rollbackAvailable: false,
      errors: [] as string[]
    };

    try {
      // إنشاء نسخة احتياطية إذا لزم الأمر
      if (options.createBackup || plan.backupRequired) {
        try {
          const backup = await this.dbManager.createBackup(connectionId, {
            name: `قبل الهجرة إلى ${plan.toVersion}`,
            compressed: true
          });
          result.backupId = backup.id;
          result.rollbackAvailable = true;
        } catch (error: any) {
          result.errors.push(`فشل في إنشاء النسخة الاحتياطية: ${error.message}`);
          if (!options.continueOnError) {
            return result;
          }
        }
      }

      // تنفيذ الهجرات
      for (const migration of plan.migrations) {
        try {
          if (options.dryRun) {
            // محاكاة التنفيذ فقط
            result.executedSteps.push(`[محاكاة] ${migration.name}`);
          } else {
            await this.executeMigration(connectionId, migration);
            await this.markMigrationAsApplied(migration.id);
            result.executedSteps.push(migration.name);
          }
        } catch (error: any) {
          result.failedSteps.push(migration.name);
          result.errors.push(`${migration.name}: ${error.message}`);
          
          if (!options.continueOnError) {
            break;
          }
        }
      }

      result.success = result.failedSteps.length === 0;
      
      // تحديث إصدار المخطط إذا نجحت الهجرة
      if (result.success && !options.dryRun) {
        await this.updateSchemaVersion(connectionId, plan.toVersion);
      }

    } catch (error: any) {
      result.errors.push(`خطأ عام في الهجرة: ${error.message}`);
    }

    return result;
  }

  private async executeMigration(connectionId: string, migration: Migration): Promise<void> {
    const connection = this.dbManager.getConnections().find(c => c.id === connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    const provider = await this.getProvider(connection.type);

    for (const step of migration.steps) {
      await this.executeMigrationStep(provider, connection.config, step);
    }
  }

  private async executeMigrationStep(provider: any, config: any, step: MigrationStep): Promise<void> {
    switch (step.type) {
      case 'create_table':
        await provider.createTable(config, step.data);
        break;
      
      case 'alter_table':
        if (step.query) {
          await provider.executeQuery(config, step.query);
        }
        break;
      
      case 'insert_data':
        if (step.data) {
          await provider.insertBatch(config, step.target, step.data);
        }
        break;
      
      case 'update_data':
        if (step.query) {
          await provider.executeQuery(config, step.query);
        }
        break;
      
      case 'custom':
        if (step.query) {
          await provider.executeQuery(config, step.query);
        }
        break;
      
      default:
        throw new Error(`نوع خطوة الهجرة غير مدعوم: ${step.type}`);
    }
  }

  // ============ إنشاء هجرات محددة ============

  private createTableCreationMigration(tables: string[]): Migration {
    const expectedSchema = this.getExpectedSchema();
    const steps: MigrationStep[] = [];

    for (const tableName of tables) {
      const tableSchema = expectedSchema.tables.find((t: any) => t.name === tableName);
      if (tableSchema) {
        steps.push({
          id: `create_table_${tableName}`,
          name: `إنشاء الجدول ${tableName}`,
          type: 'create_table',
          target: tableName,
          data: tableSchema,
          reversible: true
        });
      }
    }

    return {
      id: `create_tables_${Date.now()}`,
      version: '1.0.0',
      name: 'إنشاء الجداول المفقودة',
      description: `إنشاء ${tables.length} جدول مفقود`,
      steps,
      applied: false,
      rollbackSteps: steps.map(step => ({
        ...step,
        type: 'custom' as const,
        query: `DROP TABLE IF EXISTS ${step.target}`
      }))
    };
  }

  private createSchemaUpdateMigration(differences: any[]): Migration {
    const steps: MigrationStep[] = [];

    for (const diff of differences) {
      // إضافة الأعمدة المفقودة
      for (const column of diff.missingColumns) {
        steps.push({
          id: `add_column_${diff.tableName}_${column}`,
          name: `إضافة العمود ${column} إلى ${diff.tableName}`,
          type: 'alter_table',
          target: diff.tableName,
          query: this.generateAddColumnQuery(diff.tableName, column),
          reversible: true
        });
      }

      // تحديث الأعمدة المختلفة
      for (const columnDiff of diff.differentColumns) {
        steps.push({
          id: `modify_column_${diff.tableName}_${columnDiff.columnName}`,
          name: `تعديل العمود ${columnDiff.columnName} في ${diff.tableName}`,
          type: 'alter_table',
          target: diff.tableName,
          query: this.generateModifyColumnQuery(diff.tableName, columnDiff),
          reversible: true
        });
      }
    }

    return {
      id: `schema_update_${Date.now()}`,
      version: '1.0.0',
      name: 'تحديث مخطط الجداول',
      description: `تحديث ${differences.length} جدول`,
      steps,
      applied: false
    };
  }

  private createIndexCreationMigration(indexes: string[]): Migration {
    const steps: MigrationStep[] = indexes.map(index => ({
      id: `create_index_${index.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: `إنشاء الفهرس ${index}`,
      type: 'custom',
      target: index,
      query: this.generateCreateIndexQuery(index),
      reversible: true
    }));

    return {
      id: `create_indexes_${Date.now()}`,
      version: '1.0.0',
      name: 'إنشاء الفهارس المفقودة',
      description: `إنشاء ${indexes.length} فهرس`,
      steps,
      applied: false
    };
  }

  private createRelationCreationMigration(relations: string[]): Migration {
    const steps: MigrationStep[] = relations.map(relation => ({
      id: `create_relation_${relation.replace(/[^a-zA-Z0-9]/g, '_')}`,
      name: `إنشاء العلاقة ${relation}`,
      type: 'custom',
      target: relation,
      query: this.generateCreateRelationQuery(relation),
      reversible: true
    }));

    return {
      id: `create_relations_${Date.now()}`,
      version: '1.0.0',
      name: 'إنشاء العلاقات المفقودة',
      description: `إنشاء ${relations.length} علاقة`,
      steps,
      applied: false
    };
  }

  private async createDataMigration(connectionId: string, fromVersion: string, toVersion: string): Promise<Migration> {
    // منطق نقل البيانات بناءً على الإصدارات
    const steps: MigrationStep[] = [];

    // مثال: تحويل البيانات من تنسيق قديم إلى جديد
    if (fromVersion === '1.0.0' && toVersion === '2.0.0') {
      steps.push({
        id: 'migrate_customer_data_v2',
        name: 'ترقية بيانات العملاء إلى الإصدار 2.0',
        type: 'custom',
        target: 'customers',
        query: `UPDATE customers SET preferences = '{}' WHERE preferences IS NULL`,
        reversible: false
      });
    }

    return {
      id: `data_migration_${fromVersion}_to_${toVersion}`,
      version: toVersion,
      name: `نقل البيانات من ${fromVersion} إلى ${toVersion}`,
      description: 'ترقية البيانات الموجودة للتوافق مع المخطط الجديد',
      steps,
      applied: false
    };
  }

  // ============ وظائف مساعدة ============

  private async getProvider(type: string): Promise<any> {
    const { createProvider } = await import('./index');
    return createProvider(type);
  }

  private getExpectedSchema(): any {
    // إرجاع المخطط المتوقع (نفس المخطط في DatabaseManager)
    return {
      tables: [
        {
          name: 'services',
          columns: [
            { name: 'id', type: 'varchar', primaryKey: true },
            { name: 'name', type: 'varchar', required: true },
            { name: 'nameAr', type: 'varchar', required: true },
            { name: 'description', type: 'text' },
            { name: 'price', type: 'decimal', required: true },
            { name: 'category', type: 'varchar' },
            { name: 'isActive', type: 'boolean', default: true },
            { name: 'createdAt', type: 'timestamp', default: 'now()' }
          ]
        }
        // ... باقي الجداول
      ],
      indexes: [
        { table: 'bookings', columns: ['customerId'] },
        { table: 'bookings', columns: ['serviceId'] }
        // ... باقي الفهارس
      ],
      relations: []
    };
  }

  private async getCurrentSchemaVersion(connectionId: string): Promise<string> {
    // قراءة إصدار المخطط الحالي من قاعدة البيانات
    try {
      const connection = this.dbManager.getConnections().find(c => c.id === connectionId);
      if (!connection) return '0.0.0';

      const provider = await this.getProvider(connection.type);
      const version = await provider.getSchemaVersion?.(connection.config);
      return version || '1.0.0';
    } catch (error) {
      return '0.0.0';
    }
  }

  private getLatestSchemaVersion(): string {
    return '2.1.0'; // الإصدار الأحدث
  }

  private async needsDataMigration(connectionId: string, fromVersion: string, toVersion: string): Promise<boolean> {
    // تحديد ما إذا كانت هناك حاجة لنقل البيانات
    const majorVersionChange = fromVersion.split('.')[0] !== toVersion.split('.')[0];
    return majorVersionChange;
  }

  private async markMigrationAsApplied(migrationId: string): Promise<void> {
    this.appliedMigrations.add(migrationId);
    // حفظ في قاعدة البيانات أو التخزين المحلي
  }

  private async updateSchemaVersion(connectionId: string, version: string): Promise<void> {
    const connection = this.dbManager.getConnections().find(c => c.id === connectionId);
    if (!connection) return;

    try {
      const provider = await this.getProvider(connection.type);
      await provider.setSchemaVersion?.(connection.config, version);
    } catch (error) {
      console.warn('تعذر تحديث إصدار المخطط:', error);
    }
  }

  private generateAddColumnQuery(tableName: string, column: string): string {
    return `ALTER TABLE ${tableName} ADD COLUMN ${column} VARCHAR(255)`;
  }

  private generateModifyColumnQuery(tableName: string, columnDiff: any): string {
    return `ALTER TABLE ${tableName} MODIFY COLUMN ${columnDiff.columnName} ${columnDiff.expectedType}`;
  }

  private generateCreateIndexQuery(index: string): string {
    const [table, columns] = index.split('.');
    return `CREATE INDEX idx_${table}_${columns.replace(',', '_')} ON ${table} (${columns})`;
  }

  private generateCreateRelationQuery(relation: string): string {
    return `-- Create relation: ${relation}`;
  }

  private loadMigrations(): void {
    // تحميل الهجرات من الملفات أو قاعدة البيانات
  }

  private async getMigrationPlan(planId: string): Promise<MigrationPlan | null> {
    // تحميل خطة الهجرة
    return null;
  }

  // ============ واجهة برمجة التطبيقات العامة ============

  async getMigrations(): Promise<Migration[]> {
    return Array.from(this.migrations.values());
  }

  async rollbackMigration(migrationId: string): Promise<void> {
    const migration = this.migrations.get(migrationId);
    if (!migration || !migration.rollbackSteps) {
      throw new Error('Migration not found or not reversible');
    }

    // تنفيذ خطوات التراجع
    // ...
  }
}
