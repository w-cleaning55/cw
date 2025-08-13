import { DatabaseManager, DatabaseConnection, DataTransferJob } from './DatabaseManager';

export interface DataMapping {
  sourceTable: string;
  targetTable: string;
  fieldMapping: { [sourceField: string]: string };
  filter?: (record: any) => boolean;
  transform?: (record: any) => any;
  validation?: (record: any) => string | null; // null = valid, string = error message
}

export interface TransferProgress {
  jobId: string;
  status: 'preparing' | 'transferring' | 'validating' | 'completed' | 'failed' | 'paused';
  currentPhase: string;
  totalTables: number;
  completedTables: number;
  currentTable?: string;
  totalRecords: number;
  transferredRecords: number;
  failedRecords: number;
  startTime: Date;
  estimatedCompletion?: Date;
  throughput: number; // records per second
  errors: Array<{
    table: string;
    record?: any;
    error: string;
    timestamp: Date;
    severity: 'warning' | 'error' | 'critical';
  }>;
  warnings: string[];
}

export class DataTransferManager {
  private dbManager: DatabaseManager;
  private activeJobs: Map<string, DataTransferJob> = new Map();
  private progressCallbacks: Map<string, (progress: TransferProgress) => void> = new Map();

  constructor(databaseManager: DatabaseManager) {
    this.dbManager = databaseManager;
  }

  // ============ إنشاء وظيفة النقل ============

  async createTransferJob(
    sourceConnectionId: string,
    targetConnectionId: string,
    mappings: DataMapping[],
    options: {
      name?: string;
      batchSize?: number;
      skipIfExists?: boolean;
      truncateTarget?: boolean;
      validateData?: boolean;
      parallelTables?: number;
      resumable?: boolean;
    } = {}
  ): Promise<string> {
    const sourceConnection = this.dbManager.getConnections().find(c => c.id === sourceConnectionId);
    const targetConnection = this.dbManager.getConnections().find(c => c.id === targetConnectionId);

    if (!sourceConnection || !targetConnection) {
      throw new Error('Source or target connection not found');
    }

    if (!sourceConnection.isConnected || !targetConnection.isConnected) {
      throw new Error('Both connections must be connected');
    }

    const jobId = `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // تحويل المخططات إلى تنسيق الوظيفة
    const jobMapping: { [sourceTable: string]: any } = {};
    
    for (const mapping of mappings) {
      jobMapping[mapping.sourceTable] = {
        targetTable: mapping.targetTable,
        fieldMapping: mapping.fieldMapping,
        transform: mapping.transform,
        filter: mapping.filter,
        validation: mapping.validation
      };
    }

    const job: DataTransferJob = {
      id: jobId,
      name: options.name || `نقل البيانات ${new Date().toLocaleString('ar')}`,
      source: sourceConnection,
      target: targetConnection,
      mapping: jobMapping,
      options: {
        batchSize: options.batchSize || 1000,
        skipIfExists: options.skipIfExists || false,
        truncateTarget: options.truncateTarget || false,
        validateData: options.validateData || true
      },
      status: 'pending',
      progress: {
        totalTables: mappings.length,
        completedTables: 0,
        totalRecords: 0,
        transferredRecords: 0,
        errors: []
      }
    };

    this.activeJobs.set(jobId, job);
    await this.saveJob(job);

    return jobId;
  }

  // ============ تنفيذ النقل ============

  async executeTransfer(
    jobId: string,
    progressCallback?: (progress: TransferProgress) => void
  ): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) {
      throw new Error('Transfer job not found');
    }

    if (progressCallback) {
      this.progressCallbacks.set(jobId, progressCallback);
    }

    const progress: TransferProgress = {
      jobId,
      status: 'preparing',
      currentPhase: 'تحضير النقل',
      totalTables: job.progress.totalTables,
      completedTables: 0,
      totalRecords: 0,
      transferredRecords: 0,
      failedRecords: 0,
      startTime: new Date(),
      throughput: 0,
      errors: [],
      warnings: []
    };

    try {
      job.status = 'running';
      job.startedAt = new Date().toISOString();
      
      await this.updateProgress(progress);

      // الحصول على موفري قواعد البيانات
      const sourceProvider = await this.getProvider(job.source.type);
      const targetProvider = await this.getProvider(job.target.type);

      // مرحلة التحضير
      progress.currentPhase = 'فحص البيانات المصدر';
      await this.updateProgress(progress);

      // حساب إجمالي السجلات
      const tableCounts = await this.calculateTotalRecords(sourceProvider, job);
      progress.totalRecords = Object.values(tableCounts).reduce((sum: number, count: any) => sum + count, 0);

      // تحضير الجداول المستهدفة
      if (job.options.truncateTarget) {
        progress.currentPhase = 'تفريغ الجداول المستهدفة';
        await this.updateProgress(progress);
        await this.truncateTargetTables(targetProvider, job);
      }

      // بدء نقل البيانات
      progress.status = 'transferring';
      const startTime = Date.now();

      for (const [sourceTable, mapping] of Object.entries(job.mapping)) {
        progress.currentTable = sourceTable;
        progress.currentPhase = `نقل بيانات ${sourceTable}`;
        await this.updateProgress(progress);

        try {
          await this.transferTable(
            sourceProvider,
            targetProvider,
            job,
            sourceTable,
            mapping,
            progress
          );

          progress.completedTables++;
          await this.updateProgress(progress);

        } catch (error: any) {
          const errorInfo = {
            table: sourceTable,
            error: error.message,
            timestamp: new Date(),
            severity: 'error' as const
          };

          progress.errors.push(errorInfo);
          
          if (error.message.includes('CRITICAL')) {
            progress.status = 'failed';
            throw error;
          } else {
            progress.warnings.push(`فشل في نقل الجدول ${sourceTable}: ${error.message}`);
          }
        }
      }

      // مرحلة التحقق
      if (job.options.validateData) {
        progress.status = 'validating';
        progress.currentPhase = 'التحقق من صحة البيانات';
        await this.updateProgress(progress);
        
        await this.validateTransferredData(sourceProvider, targetProvider, job, progress);
      }

      // اكتمال النقل
      progress.status = 'completed';
      progress.currentPhase = 'تم الانتهاء';
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // seconds
      progress.throughput = progress.transferredRecords / duration;
      
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      
      await this.updateProgress(progress);
      await this.saveJob(job);

    } catch (error: any) {
      progress.status = 'failed';
      progress.currentPhase = `فشل: ${error.message}`;
      
      job.status = 'failed';
      
      await this.updateProgress(progress);
      await this.saveJob(job);
      
      throw error;
    }
  }

  // ============ نقل جدول واحد ============

  private async transferTable(
    sourceProvider: any,
    targetProvider: any,
    job: DataTransferJob,
    sourceTable: string,
    mapping: any,
    progress: TransferProgress
  ): Promise<void> {
    const batchSize = job.options.batchSize;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      // جلب دفعة من البيانات
      const records = await sourceProvider.findMany(
        job.source.config,
        sourceTable,
        {},
        { limit: batchSize, offset }
      );

      if (!records || records.length === 0) {
        hasMore = false;
        break;
      }

      // معالجة البيانات
      const processedRecords = await this.processRecords(records, mapping, progress);
      
      if (processedRecords.length > 0) {
        // إدراج البيانات في الجدول المستهدف
        try {
          await targetProvider.insertBatch(
            job.target.config,
            mapping.targetTable,
            processedRecords
          );

          progress.transferredRecords += processedRecords.length;
          
        } catch (error: any) {
          // معالجة الأخطاء على مستوى السجل
          if (job.options.skipIfExists && error.message.includes('duplicate')) {
            progress.warnings.push(`تم تخطي ${processedRecords.length} سجل مكرر في ${sourceTable}`);
          } else {
            throw error;
          }
        }
      }

      offset += batchSize;
      hasMore = records.length === batchSize;

      // تحديث التقدم كل 1000 سجل
      if (progress.transferredRecords % 1000 === 0) {
        await this.updateProgress(progress);
      }
    }
  }

  // ============ معالجة السجلات ============

  private async processRecords(
    records: any[],
    mapping: any,
    progress: TransferProgress
  ): Promise<any[]> {
    const processedRecords: any[] = [];

    for (const record of records) {
      try {
        // تطبيق الفلتر
        if (mapping.filter && !mapping.filter(record)) {
          continue;
        }

        // تحويل أسماء الحقول
        const mappedRecord: any = {};
        for (const [sourceField, targetField] of Object.entries(mapping.fieldMapping)) {
          if (record[sourceField] !== undefined) {
            mappedRecord[targetField] = record[sourceField];
          }
        }

        // تطبيق التحويلات
        let transformedRecord = mappedRecord;
        if (mapping.transform) {
          transformedRecord = mapping.transform(mappedRecord);
        }

        // التحقق من صحة البيانات
        if (mapping.validation) {
          const validationError = mapping.validation(transformedRecord);
          if (validationError) {
            progress.errors.push({
              table: mapping.targetTable,
              record: transformedRecord,
              error: `خطأ في التحقق: ${validationError}`,
              timestamp: new Date(),
              severity: 'warning'
            });
            continue;
          }
        }

        processedRecords.push(transformedRecord);

      } catch (error: any) {
        progress.errors.push({
          table: mapping.targetTable,
          record,
          error: `خطأ في معالجة السجل: ${error.message}`,
          timestamp: new Date(),
          severity: 'error'
        });
        progress.failedRecords++;
      }
    }

    return processedRecords;
  }

  // ============ التحقق من البيانات ============

  private async validateTransferredData(
    sourceProvider: any,
    targetProvider: any,
    job: DataTransferJob,
    progress: TransferProgress
  ): Promise<void> {
    const validationErrors: string[] = [];

    for (const [sourceTable, mapping] of Object.entries(job.mapping)) {
      try {
        // عد السجلات في المصدر والهدف
        const sourceCount = await sourceProvider.count(job.source.config, sourceTable);
        const targetCount = await targetProvider.count(job.target.config, mapping.targetTable);

        // مقارنة العدد (مع مراعاة الفلاتر)
        if (mapping.filter) {
          // للجداول المفلترة، نقوم بفحص عينة عشوائية
          const sampleSize = Math.min(100, sourceCount);
          const sampleRecords = await sourceProvider.findMany(
            job.source.config,
            sourceTable,
            {},
            { limit: sampleSize, offset: Math.floor(Math.random() * Math.max(1, sourceCount - sampleSize)) }
          );

          const filteredSample = sampleRecords.filter(mapping.filter);
          const estimatedTargetCount = Math.round((filteredSample.length / sampleSize) * sourceCount);
          
          const difference = Math.abs(targetCount - estimatedTargetCount);
          const tolerance = Math.max(1, Math.round(estimatedTargetCount * 0.05)); // 5% tolerance

          if (difference > tolerance) {
            validationErrors.push(
              `عدم تطابق في العدد للجدول ${sourceTable}: متوقع ~${estimatedTargetCount}, فعلي ${targetCount}`
            );
          }
        } else {
          if (sourceCount !== targetCount) {
            validationErrors.push(
              `عدم تطابق في العدد للجدول ${sourceTable}: مصدر ${sourceCount}, هدف ${targetCount}`
            );
          }
        }

        // فحص تكامل البيانات الحيوية
        await this.validateCriticalFields(sourceProvider, targetProvider, job, sourceTable, mapping);

      } catch (error: any) {
        validationErrors.push(`خطأ في التحقق من الجدول ${sourceTable}: ${error.message}`);
      }
    }

    if (validationErrors.length > 0) {
      progress.warnings.push(...validationErrors);
    }
  }

  private async validateCriticalFields(
    sourceProvider: any,
    targetProvider: any,
    job: DataTransferJob,
    sourceTable: string,
    mapping: any
  ): Promise<void> {
    // فحص الحقول الحيوية مثل المفاتيح الأساسية والحقول المطلوبة
    const criticalFields = Object.keys(mapping.fieldMapping).filter(field => 
      field.includes('id') || field.includes('email') || field.includes('phone')
    );

    if (criticalFields.length === 0) return;

    // أخذ عينة عشوائية للفحص
    const sampleSize = 50;
    const sourceRecords = await sourceProvider.findMany(
      job.source.config,
      sourceTable,
      {},
      { limit: sampleSize }
    );

    for (const sourceRecord of sourceRecords) {
      for (const criticalField of criticalFields) {
        const sourceValue = sourceRecord[criticalField];
        if (sourceValue) {
          const targetField = mapping.fieldMapping[criticalField];
          const targetRecord = await targetProvider.findOne(
            job.target.config,
            mapping.targetTable,
            { [targetField]: sourceValue }
          );

          if (!targetRecord) {
            throw new Error(`السجل الحيوي مفقود: ${criticalField}=${sourceValue}`);
          }
        }
      }
    }
  }

  // ============ وظائف مساعدة ============

  private async calculateTotalRecords(sourceProvider: any, job: DataTransferJob): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};

    for (const sourceTable of Object.keys(job.mapping)) {
      try {
        const count = await sourceProvider.count(job.source.config, sourceTable);
        counts[sourceTable] = count;
      } catch (error) {
        counts[sourceTable] = 0;
      }
    }

    return counts;
  }

  private async truncateTargetTables(targetProvider: any, job: DataTransferJob): Promise<void> {
    for (const mapping of Object.values(job.mapping)) {
      try {
        await targetProvider.truncateTable(job.target.config, mapping.targetTable);
      } catch (error) {
        // تجاهل أخطاء الجداول غير الموجودة
        console.warn(`تعذر تفريغ الجدول ${mapping.targetTable}:`, error);
      }
    }
  }

  private async updateProgress(progress: TransferProgress): Promise<void> {
    const callback = this.progressCallbacks.get(progress.jobId);
    if (callback) {
      callback(progress);
    }
  }

  private async getProvider(type: string): Promise<any> {
    const { createProvider } = await import('./index');
    return createProvider(type);
  }

  private async saveJob(job: DataTransferJob): Promise<void> {
    const jobs = this.getStoredJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    
    if (index >= 0) {
      jobs[index] = job;
    } else {
      jobs.push(job);
    }

    localStorage.setItem('data-transfer-jobs', JSON.stringify(jobs));
  }

  private getStoredJobs(): DataTransferJob[] {
    const stored = localStorage.getItem('data-transfer-jobs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('خطأ في تحميل وظائف النقل:', error);
      }
    }
    return [];
  }

  // ============ إدارة الوظائف ============

  async pauseTransfer(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (job && job.status === 'running') {
      job.status = 'paused';
      await this.saveJob(job);
    }
  }

  async resumeTransfer(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (job && job.status === 'paused') {
      await this.executeTransfer(jobId);
    }
  }

  async cancelTransfer(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (job) {
      job.status = 'failed';
      await this.saveJob(job);
      this.activeJobs.delete(jobId);
      this.progressCallbacks.delete(jobId);
    }
  }

  getTransferJobs(): DataTransferJob[] {
    return this.getStoredJobs();
  }

  getActiveJobs(): DataTransferJob[] {
    return Array.from(this.activeJobs.values());
  }

  async deleteJob(jobId: string): Promise<void> {
    const jobs = this.getStoredJobs().filter(j => j.id !== jobId);
    localStorage.setItem('data-transfer-jobs', JSON.stringify(jobs));
    
    this.activeJobs.delete(jobId);
    this.progressCallbacks.delete(jobId);
  }

  // ============ قوالب النقل الجاهزة ============

  getCommonMappings(sourceType: string, targetType: string): DataMapping[] {
    const mappings: DataMapping[] = [];

    // قوالب شائعة للجداول الأساسية
    if (this.shouldIncludeTable('services', sourceType, targetType)) {
      mappings.push({
        sourceTable: 'services',
        targetTable: 'services',
        fieldMapping: {
          'id': 'id',
          'name': 'name',
          'nameAr': 'name_ar',
          'description': 'description',
          'descriptionAr': 'description_ar',
          'price': 'price',
          'category': 'category',
          'isActive': 'is_active',
          'createdAt': 'created_at',
          'updatedAt': 'updated_at'
        },
        validation: (record) => {
          if (!record.name || !record.price) {
            return 'الاسم والسعر مطلوبان';
          }
          if (record.price < 0) {
            return 'السعر يجب أن يكون موجباً';
          }
          return null;
        }
      });
    }

    if (this.shouldIncludeTable('customers', sourceType, targetType)) {
      mappings.push({
        sourceTable: 'customers',
        targetTable: 'customers',
        fieldMapping: {
          'id': 'id',
          'name': 'name',
          'email': 'email',
          'phone': 'phone',
          'address': 'address',
          'district': 'district',
          'city': 'city',
          'isActive': 'is_active',
          'createdAt': 'created_at',
          'updatedAt': 'updated_at'
        },
        validation: (record) => {
          if (!record.name || !record.phone) {
            return 'الاسم والهاتف مطلوبان';
          }
          if (record.email && !record.email.includes('@')) {
            return 'البريد الإلكتروني غير صحيح';
          }
          return null;
        }
      });
    }

    return mappings;
  }

  private shouldIncludeTable(tableName: string, sourceType: string, targetType: string): boolean {
    // منطق تحديد الجداول المتوافقة بين أنواع قواعد البيانات
    const compatibilityMatrix: Record<string, string[]> = {
      'services': ['supabase', 'mongodb', 'firebase', 'json'],
      'customers': ['supabase', 'mongodb', 'firebase', 'json'],
      'bookings': ['supabase', 'mongodb', 'firebase', 'json'],
      'users': ['supabase', 'mongodb', 'firebase'],
      'messages': ['supabase', 'mongodb', 'json'],
      'notifications': ['supabase', 'mongodb', 'json']
    };

    const supportedTypes = compatibilityMatrix[tableName] || [];
    return supportedTypes.includes(sourceType) && supportedTypes.includes(targetType);
  }
}
