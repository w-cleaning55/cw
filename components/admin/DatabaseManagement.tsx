"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import {
  Database,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Upload,
  Play,
  Pause,
  Settings,
  Shield,
  Clock,
  HardDrive,
  Network,
  FileText,
  Zap,
  Activity,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useNotify } from "../NotificationSystem";
import {
  databaseManager,
  DatabaseConnection,
  BackupMetadata,
} from "../../lib/database/DatabaseManager";
import {
  MigrationManager,
  MigrationPlan,
  SchemaComparison,
} from "../../lib/database/MigrationManager";

interface DatabaseStats {
  totalRecords: number;
  totalTables: number;
  dbSize: string;
  lastBackup?: string;
  schemaVersion: string;
  uptime: string;
}

export default function DatabaseManagement() {
  const { t } = useTranslation();
  const notify = useNotify();

  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [activeConnection, setActiveConnection] =
    useState<DatabaseConnection | null>(null);
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [migrationManager] = useState(
    () => new MigrationManager(databaseManager),
  );

  // حالات النماذج
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const [editingConnection, setEditingConnection] =
    useState<DatabaseConnection | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(
    null,
  );
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // بيانات الاتصال الجديد
  const [newConnection, setNewConnection] = useState({
    name: "",
    type: "supabase" as const,
    config: {},
  });

  // حالة قاعدة البيانات
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    totalRecords: 0,
    totalTables: 0,
    dbSize: "0 MB",
    schemaVersion: "1.0.0",
    uptime: "0h",
  });

  const [schemaComparison, setSchemaComparison] =
    useState<SchemaComparison | null>(null);
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlan | null>(
    null,
  );

  // تحميل البيانات الأولية
  useEffect(() => {
    loadConnections();
    loadBackups();
    loadActiveConnection();
  }, []);

  // تحديث الإحصائيات عند تغيير الاتصال النشط
  useEffect(() => {
    if (activeConnection) {
      loadDatabaseStats();
      checkSchemaStatus();
    }
  }, [activeConnection]);

  // ============ تحميل البيانات ============

  const loadConnections = () => {
    const conns = databaseManager.getConnections();
    setConnections(conns);
  };

  const loadActiveConnection = () => {
    const active = databaseManager.getActiveConnection();
    setActiveConnection(active);
  };

  const loadBackups = () => {
    const backupList = databaseManager.getBackupsList();
    setBackups(backupList);
  };

  const loadDatabaseStats = async () => {
    if (!activeConnection) return;

    try {
      // محاكاة تحميل الإحصائيات
      const stats: DatabaseStats = {
        totalRecords: 1250,
        totalTables: 7,
        dbSize: "15.6 MB",
        lastBackup: "2024-01-15T10:30:00Z",
        schemaVersion: "2.0.1",
        uptime: "15 أيام",
      };
      setDbStats(stats);
    } catch (error) {
      console.error("خطأ في تحميل إحصائيات قاعدة البيانات:", error);
    }
  };

  // ============ إدارة الاتصالات ============

  const handleAddConnection = async () => {
    try {
      const connectionId = await databaseManager.addConnection(newConnection);
      notify.success("تم الإضافة", "تم إضافة الاتصال بنجاح");

      setNewConnection({ name: "", type: "supabase", config: {} });
      setIsAddingConnection(false);
      loadConnections();
    } catch (error: any) {
      notify.error("خطأ في الإضافة", error.message);
    }
  };

  const handleTestConnection = async (connectionId: string) => {
    setIsTestingConnection(connectionId);

    try {
      const result = await databaseManager.testConnection(connectionId);

      if (result.success) {
        notify.success("نجح الاتصال", "تم الاتصال بقاعدة البيانات بنجاح");
      } else {
        notify.error("فشل الاتصال", result.message);
      }

      loadConnections();
    } catch (error: any) {
      notify.error("خطأ في الاختبار", error.message);
    } finally {
      setIsTestingConnection(null);
    }
  };

  const handleActivateConnection = async (connectionId: string) => {
    try {
      const result = await databaseManager.setActiveConnection(connectionId);

      notify.success("تم التفعيل", "تم تفعيل قاعدة البيانات بنجاح");

      if (result.setupRequired) {
        notify.info(
          "إعداد قاعدة البيانات",
          `تم تنفيذ: ${result.actions.join(", ")}`,
        );
      }

      loadConnections();
      loadActiveConnection();
    } catch (error: any) {
      notify.error("خطأ في التفعيل", error.message);
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الاتصال؟")) {
      try {
        await databaseManager.deleteConnection(connectionId);
        notify.success("تم الحذف", "تم حذف الاتصال بنجاح");
        loadConnections();
        loadActiveConnection();
      } catch (error: any) {
        notify.error("خطأ في الحذف", error.message);
      }
    }
  };

  // ============ إدارة النسخ الاحتياطي ============

  const handleCreateBackup = async () => {
    if (!activeConnection) {
      notify.error("خطأ", "لا يوجد اتصال نشط");
      return;
    }

    setIsCreatingBackup(true);

    try {
      const backup = await databaseManager.createBackup(activeConnection.id, {
        compressed: true,
      });

      notify.success("تم الإنشاء", "تم إنشاء النسخة الاحتياطية بنجاح");
      loadBackups();
    } catch (error: any) {
      notify.error("خطأ في النسخ الاحتياطي", error.message);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async (backupId: string) => {
    if (!activeConnection) {
      notify.error("خطأ", "لا يوجد اتصال نشط");
      return;
    }

    if (
      !window.confirm(
        "هل أنت متأكد من استعادة هذه النسخة الاحتياطية؟ سيتم استبدال البيانات الحالية.",
      )
    ) {
      return;
    }

    try {
      await databaseManager.restoreBackup(backupId, activeConnection.id, {
        overwriteExisting: true,
      });

      notify.success("تم الاستعادة", "تم استعادة النسخة الاحتياطية بنجاح");
      loadDatabaseStats();
    } catch (error: any) {
      notify.error("خطأ في الاستعادة", error.message);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذه النسخة الاحتياطية؟")) {
      try {
        await databaseManager.deleteBackup(backupId);
        notify.success("تم الحذف", "تم حذف النسخة الاحتياطية");
        loadBackups();
      } catch (error: any) {
        notify.error("خطأ في الحذف", error.message);
      }
    }
  };

  // ============ إدارة الهجرة ============

  const checkSchemaStatus = async () => {
    if (!activeConnection) return;

    try {
      const comparison = await migrationManager.compareSchemas(
        activeConnection.id,
      );
      setSchemaComparison(comparison);

      // إنشاء خطة هجرة إذا لزم الأمر
      if (
        comparison.missingTables.length > 0 ||
        comparison.differentTables.length > 0 ||
        comparison.missingIndexes.length > 0
      ) {
        const plan = await migrationManager.createMigrationPlan(
          activeConnection.id,
        );
        setMigrationPlan(plan);
      } else {
        setMigrationPlan(null);
      }
    } catch (error) {
      console.error("خطأ في فحص المخطط:", error);
    }
  };

  const handleExecuteMigration = async () => {
    if (!activeConnection || !migrationPlan) return;

    setIsMigrating(true);

    try {
      const result = await migrationManager.executeMigrationPlan(
        activeConnection.id,
        migrationPlan.id,
        {
          createBackup: migrationPlan.backupRequired,
          dryRun: false,
          continueOnError: false,
        },
      );

      if (result.success) {
        notify.success("نجحت الهجرة", "تم تطبيق جميع التحديثات بنجاح");
        setMigrationPlan(null);
        setSchemaComparison(null);
        loadDatabaseStats();
      } else {
        notify.error("فشلت الهجرة", `فشل في: ${result.failedSteps.join(", ")}`);
      }
    } catch (error: any) {
      notify.error("خطأ في الهجرة", error.message);
    } finally {
      setIsMigrating(false);
    }
  };

  // ============ وظائف مساعدة ============

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case "supabase":
        return <Database className="w-5 h-5 text-green-500" />;
      case "mongodb":
        return <Database className="w-5 h-5 text-green-600" />;
      case "firebase":
        return <Database className="w-5 h-5 text-orange-500" />;
      default:
        return <Database className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (connection: DatabaseConnection) => {
    if (connection.isActive) {
      return <Badge className="bg-green-500">نشط</Badge>;
    } else if (connection.isConnected) {
      return <Badge variant="secondary">متصل</Badge>;
    } else {
      return <Badge variant="outline">غير متصل</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة قواعد البيانات</h1>
          <p className="text-muted-foreground">
            إدارة الاتصالات والنسخ الاحتياطي والهجرة
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddingConnection(true)}>
            <Plus className="w-4 h-4 mr-2" />
            اتصال جديد
          </Button>
          {activeConnection && (
            <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
              {isCreatingBackup ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              نسخة احتياطية
            </Button>
          )}
        </div>
      </div>

      {/* إحصائيات سريعة */}
      {activeConnection && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {dbStats.totalRecords.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    إجمالي السجلات
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{dbStats.totalTables}</p>
                  <p className="text-xs text-muted-foreground">الجداول</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{dbStats.dbSize}</p>
                  <p className="text-xs text-muted-foreground">
                    حجم قاعدة البيانات
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{dbStats.uptime}</p>
                  <p className="text-xs text-muted-foreground">وقت التشغيل</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connections">
            <Network className="w-4 h-4 mr-2" />
            الاتصالات
          </TabsTrigger>
          <TabsTrigger value="backups">
            <Download className="w-4 h-4 mr-2" />
            النسخ الاحتياطي
          </TabsTrigger>
          <TabsTrigger value="migration">
            <Zap className="w-4 h-4 mr-2" />
            الهجرة
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* علامة تبويب الاتصالات */}
        <TabsContent value="connections">
          <div className="space-y-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getConnectionIcon(connection.type)}
                      <div>
                        <h3 className="font-medium">{connection.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {connection.type.toUpperCase()}
                          {connection.lastConnected && (
                            <span className="ml-2">
                              آخر اتصال:{" "}
                              {new Date(
                                connection.lastConnected,
                              ).toLocaleString("ar")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(connection)}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(connection.id)}
                        disabled={isTestingConnection === connection.id}
                      >
                        {isTestingConnection === connection.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </Button>

                      {!connection.isActive && connection.isConnected && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            handleActivateConnection(connection.id)
                          }
                        >
                          تفعيل
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingConnection(connection)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteConnection(connection.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {connection.metadata && (
                    <div className="mt-3 text-sm text-muted-foreground">
                      <div className="flex space-x-4">
                        {connection.metadata.tables && (
                          <span>
                            الجداول: {connection.metadata.tables.length}
                          </span>
                        )}
                        {connection.metadata.size && (
                          <span>
                            الحجم: {formatFileSize(connection.metadata.size)}
                          </span>
                        )}
                        {connection.metadata.version && (
                          <span>الإصدار: {connection.metadata.version}</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {connections.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">لا توجد اتصالات</h3>
                  <p className="text-muted-foreground mb-4">
                    أضف اتصال قاعدة بيانات للبدء
                  </p>
                  <Button onClick={() => setIsAddingConnection(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة اتصال
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* علامة تبويب النسخ الاحتياطي */}
        <TabsContent value="backups">
          <div className="space-y-4">
            {backups.map((backup) => (
              <Card key={backup.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{backup.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          تاريخ الإنشاء:{" "}
                          {new Date(backup.createdAt).toLocaleString("ar")}
                        </p>
                        <p>الحجم: {formatFileSize(backup.size)}</p>
                        <p>السجلات: {backup.recordCount.toLocaleString()}</p>
                        <p>الجداول: {backup.tables.join(", ")}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreBackup(backup.id)}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        استعادة
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {backups.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Download className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    لا توجد نسخ احتياطية
                  </h3>
                  <p className="text-muted-foreground">
                    النسخ الاحتياطية تحمي بياناتك
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* علامة تبويب الهجرة */}
        <TabsContent value="migration">
          <div className="space-y-4">
            {/* حالة المخطط */}
            {schemaComparison && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    حالة مخطط قاعدة البيانات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium text-sm">الجداول المفقودة</p>
                      <p className="text-2xl font-bold text-red-500">
                        {schemaComparison.missingTables.length}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">الجداول المختلفة</p>
                      <p className="text-2xl font-bold text-yellow-500">
                        {schemaComparison.differentTables.length}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">الفهارس المفقودة</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {schemaComparison.missingIndexes.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* خطة الهجرة */}
            {migrationPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    خطة الهجرة
                  </CardTitle>
                  <CardDescription>{migrationPlan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{migrationPlan.name}</p>
                        <p className="text-sm text-muted-foreground">
                          من {migrationPlan.fromVersion} إلى{" "}
                          {migrationPlan.toVersion}
                        </p>
                      </div>
                      <Badge
                        variant={
                          migrationPlan.riskLevel === "low"
                            ? "default"
                            : migrationPlan.riskLevel === "medium"
                              ? "secondary"
                              : migrationPlan.riskLevel === "high"
                                ? "destructive"
                                : "destructive"
                        }
                      >
                        {migrationPlan.riskLevel === "low"
                          ? "مخاطر منخفضة"
                          : migrationPlan.riskLevel === "medium"
                            ? "مخاطر متوسطة"
                            : migrationPlan.riskLevel === "high"
                              ? "مخاطر عالية"
                              : "مخاطر حرجة"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">الوقت المتوقع</p>
                        <p className="font-medium">
                          {migrationPlan.estimatedTime} دقيقة
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">عدد الهجرات</p>
                        <p className="font-medium">
                          {migrationPlan.migrations.length}
                        </p>
                      </div>
                    </div>

                    {migrationPlan.warnings.length > 0 && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800">
                            تحذيرات
                          </span>
                        </div>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {migrationPlan.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={handleExecuteMigration}
                        disabled={isMigrating}
                        className="flex-1"
                      >
                        {isMigrating ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            جارٍ التنفيذ...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            تنفيذ الهجرة
                          </>
                        )}
                      </Button>

                      {migrationPlan.backupRequired && (
                        <Button variant="outline" onClick={handleCreateBackup}>
                          <Download className="w-4 h-4 mr-2" />
                          نسخة احتياطية أولاً
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!activeConnection && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Zap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    لا يوجد اتصال نشط
                  </h3>
                  <p className="text-muted-foreground">
                    اختر قاعدة بيانات نشطة لعرض خيارات الهجرة
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* علامة تبويب الإعدادات */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات قاعدة البيانات</CardTitle>
              <CardDescription>
                الإعدادات العامة لإدار�� قاعدة البيانات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>النسخ الاحتياطي التلقائي</Label>
                  <p className="text-sm text-muted-foreground">
                    إنشاء نسخة احتياطية تلقائياً كل يوم
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>مراقبة الأداء</Label>
                  <p className="text-sm text-muted-foreground">
                    تتبع أداء قاعدة البيانات والاستعلامات
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>تنبيهات المخطط</Label>
                  <p className="text-sm text-muted-foreground">
                    إشعارات عند اكتشاف تغييرات في المخطط
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>فترة الاحتفاظ بالنسخ ا��احتياطي</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 أيام</SelectItem>
                    <SelectItem value="30">30 يوم</SelectItem>
                    <SelectItem value="90">90 يوم</SelectItem>
                    <SelectItem value="365">سنة واحدة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>
                <Settings className="w-4 h-4 mr-2" />
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* نموذج إضافة اتصال جديد */}
      {isAddingConnection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>إضافة اتصال جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>اسم الاتصال</Label>
                <Input
                  value={newConnection.name}
                  onChange={(e) =>
                    setNewConnection((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="مثل: قاعدة البيانات الرئيسية"
                />
              </div>

              <div className="space-y-2">
                <Label>نوع قاعدة البيانات</Label>
                <Select
                  value={newConnection.type}
                  onValueChange={(value: any) =>
                    setNewConnection((prev) => ({
                      ...prev,
                      type: value,
                      config: {},
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supabase">Supabase</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="firebase">Firebase</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* إعدادات خاصة بنوع قاعدة البيانات */}
              {newConnection.type === "supabase" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>رابط المشروع</Label>
                    <Input
                      placeholder="https://your-project.supabase.co"
                      onChange={(e) =>
                        setNewConnection((prev) => ({
                          ...prev,
                          config: { ...prev.config, url: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>مفتاح API</Label>
                    <Input
                      type="password"
                      placeholder="مفتاح Supabase"
                      onChange={(e) =>
                        setNewConnection((prev) => ({
                          ...prev,
                          config: { ...prev.config, key: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleAddConnection} className="flex-1">
                  إضافة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingConnection(false)}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
