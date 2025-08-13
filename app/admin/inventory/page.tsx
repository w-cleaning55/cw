"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { useTranslation } from "../../../hooks/useTranslation";
import {
  Package,
  Tool,
  Plus,
  Search,
  Filter,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Truck,
  Building,
  ShoppingCart,
  ClipboardList,
  Wrench,
  Zap,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  type: "equipment" | "supplies" | "consumables";
  brand: string;
  model: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  unitAr: string;
  location: string;
  locationAr: string;
  supplier: string;
  supplierAr: string;
  status: "available" | "in_use" | "maintenance" | "out_of_stock" | "damaged";
  condition: "excellent" | "good" | "fair" | "poor";
  lastMaintenance?: string;
  nextMaintenance?: string;
  warrantyExpiry?: string;
  notes: string;
  notesAr: string;
  usageHistory: {
    date: string;
    action: string;
    actionAr: string;
    quantity: number;
    user: string;
    notes: string;
  }[];
}

interface MaintenanceRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemNameAr: string;
  date: string;
  type: "routine" | "repair" | "replacement";
  typeAr: string;
  description: string;
  descriptionAr: string;
  cost: number;
  technician: string;
  technicianAr: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  nextDue?: string;
  notes: string;
  notesAr: string;
}

export default function InventoryManagementPage() {
  const { currentLanguage } = useTranslation();
  const isArabic = currentLanguage === "ar";
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Sample data
  useEffect(() => {
    const sampleInventory: InventoryItem[] = [
      {
        id: "inv001",
        name: "Industrial Steam Cleaner",
        nameAr: "منظف البخار الصناعي",
        category: "Cleaning Equipment",
        categoryAr: "معدات التنظيف",
        type: "equipment",
        brand: "Karcher",
        model: "SG 4/4",
        serialNumber: "KAR2023001",
        purchaseDate: "2023-01-15",
        purchasePrice: 15000,
        currentValue: 12000,
        quantity: 3,
        minQuantity: 2,
        maxQuantity: 5,
        unit: "Units",
        unitAr: "وحدات",
        location: "Main Warehouse",
        locationAr: "المستودع الرئيسي",
        supplier: "Al-Mutairi Equipment",
        supplierAr: "معدات المطيري",
        status: "available",
        condition: "excellent",
        lastMaintenance: "2024-01-15",
        nextMaintenance: "2024-04-15",
        warrantyExpiry: "2025-01-15",
        notes: "High-performance steam cleaner for deep cleaning",
        notesAr: "منظف بخار عالي الأداء للتنظيف العميق",
        usageHistory: [
          {
            date: "2024-01-20",
            action: "Used",
            actionAr: "مستخدم",
            quantity: 1,
            user: "Ahmad Al-Hassan",
            notes: "Used for villa deep cleaning",
          },
        ],
      },
      {
        id: "inv002",
        name: "Professional Vacuum Cleaner",
        nameAr: "مكنسة كهربائية احترافية",
        category: "Cleaning Equipment",
        categoryAr: "معدات التنظيف",
        type: "equipment",
        brand: "Dyson",
        model: "V15 Detect",
        serialNumber: "DYS2023002",
        purchaseDate: "2023-02-20",
        purchasePrice: 2500,
        currentValue: 2000,
        quantity: 8,
        minQuantity: 5,
        maxQuantity: 12,
        unit: "Units",
        unitAr: "وحدات",
        location: "Equipment Room A",
        locationAr: "غرفة المعدات أ",
        supplier: "Tech Solutions",
        supplierAr: "الحلول التقنية",
        status: "available",
        condition: "good",
        lastMaintenance: "2024-01-01",
        nextMaintenance: "2024-07-01",
        warrantyExpiry: "2025-02-20",
        notes: "Lightweight and powerful vacuum for regular cleaning",
        notesAr: "مكنسة خفيفة وقوية للتنظيف العادي",
        usageHistory: [],
      },
      {
        id: "inv003",
        name: "Eco-Friendly Cleaning Detergent",
        nameAr: "منظف صديق للبيئة",
        category: "Cleaning Supplies",
        categoryAr: "مواد التنظيف",
        type: "supplies",
        brand: "EcoClean",
        model: "Multi-Surface",
        purchaseDate: "2024-01-01",
        purchasePrice: 50,
        currentValue: 45,
        quantity: 25,
        minQuantity: 10,
        maxQuantity: 100,
        unit: "Liters",
        unitAr: "لتر",
        location: "Chemical Storage",
        locationAr: "مخزن المواد الكيميائية",
        supplier: "Green Supplies Co.",
        supplierAr: "شركة المستلزمات الخضراء",
        status: "available",
        condition: "excellent",
        notes: "Biodegradable all-purpose cleaner",
        notesAr: "منظف متعدد الأغراض قابل للتحلل الحيوي",
        usageHistory: [
          {
            date: "2024-01-18",
            action: "Used",
            actionAr: "مستخدم",
            quantity: 5,
            user: "Fatima Al-Zahra",
            notes: "Used for carpet cleaning job",
          },
        ],
      },
      {
        id: "inv004",
        name: "Microfiber Cleaning Cloths",
        nameAr: "أقمشة التنظيف الدقيقة",
        category: "Cleaning Supplies",
        categoryAr: "مواد التنظيف",
        type: "consumables",
        brand: "CleanPro",
        model: "Ultra-Soft",
        purchaseDate: "2024-01-10",
        purchasePrice: 15,
        currentValue: 12,
        quantity: 5,
        minQuantity: 20,
        maxQuantity: 200,
        unit: "Pieces",
        unitAr: "قطعة",
        location: "Supply Room",
        locationAr: "غرفة المستلزمات",
        supplier: "Cleaning Essentials",
        supplierAr: "أساسيات التنظيف",
        status: "out_of_stock",
        condition: "good",
        notes: "High-quality microfiber cloths for streak-free cleaning",
        notesAr: "أقمشة ميكروفايبر عالية الجودة للتنظيف بدون خطوط",
        usageHistory: [],
      },
    ];

    const sampleMaintenance: MaintenanceRecord[] = [
      {
        id: "maint001",
        itemId: "inv001",
        itemName: "Industrial Steam Cleaner",
        itemNameAr: "منظف البخار الصناعي",
        date: "2024-01-15",
        type: "routine",
        typeAr: "دورية",
        description: "Regular maintenance check and cleaning",
        descriptionAr: "فحص صيانة دورية وتنظيف",
        cost: 500,
        technician: "Mohammed Al-Qarni",
        technicianAr: "محمد القرني",
        status: "completed",
        nextDue: "2024-04-15",
        notes: "All systems functioning properly",
        notesAr: "جميع الأنظمة تعمل بشكل صحيح",
      },
      {
        id: "maint002",
        itemId: "inv002",
        itemName: "Professional Vacuum Cleaner",
        itemNameAr: "مكنسة كهربائية احترافية",
        date: "2024-02-01",
        type: "repair",
        typeAr: "إصلاح",
        description: "Replace damaged power cord",
        descriptionAr: "استبدال سلك الطاقة التالف",
        cost: 150,
        technician: "Ali Al-Rashid",
        technicianAr: "علي الراشد",
        status: "scheduled",
        notes: "Waiting for replacement part",
        notesAr: "في انتظار قطعة الغيار",
      },
    ];

    setInventory(sampleInventory);
    setMaintenance(sampleMaintenance);
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameAr.includes(searchTerm) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      in_use: "bg-blue-100 text-blue-800",
      maintenance: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800",
      damaged: "bg-red-100 text-red-800",
    };

    const labels = {
      available: isArabic ? "متاح" : "Available",
      in_use: isArabic ? "قيد الاستخدام" : "In Use",
      maintenance: isArabic ? "صيانة" : "Maintenance",
      out_of_stock: isArabic ? "نفذت الكمية" : "Out of Stock",
      damaged: isArabic ? "تالف" : "Damaged",
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} border-0`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getConditionBadge = (condition: string) => {
    const colors = {
      excellent: "bg-green-100 text-green-800",
      good: "bg-blue-100 text-blue-800",
      fair: "bg-yellow-100 text-yellow-800",
      poor: "bg-red-100 text-red-800",
    };

    const labels = {
      excellent: isArabic ? "ممتاز" : "Excellent",
      good: isArabic ? "جيد" : "Good",
      fair: isArabic ? "مقبول" : "Fair",
      poor: isArabic ? "سيء" : "Poor",
    };

    return (
      <Badge
        variant="outline"
        className={`${colors[condition as keyof typeof colors]} border-0`}
      >
        {labels[condition as keyof typeof labels]}
      </Badge>
    );
  };

  const getLowStockItems = () => {
    return inventory.filter((item) => item.quantity <= item.minQuantity);
  };

  const getMaintenanceDue = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    return inventory.filter((item) => {
      if (!item.nextMaintenance) return false;
      const maintenanceDate = new Date(item.nextMaintenance);
      return maintenanceDate <= thirtyDaysFromNow;
    });
  };

  const getTotalValue = () => {
    return inventory.reduce(
      (total, item) => total + item.currentValue * item.quantity,
      0,
    );
  };

  const categories = Array.from(
    new Set(inventory.map((item) => item.category)),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isArabic
              ? "إدارة المخزون والمعدات"
              : "Inventory & Equipment Management"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isArabic
              ? "إدارة المعدات والمواد والصيانة"
              : "Manage equipment, supplies, and maintenance"}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                {isArabic ? "إضافة عنصر" : "Add Item"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isArabic ? "إضافة عنصر جديد" : "Add New Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="p-4 text-center">
                <p className="text-gray-600">
                  {isArabic
                    ? "نموذج إضافة عنصر سيتم تطبيقه هنا"
                    : "Add item form will be implemented here"}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            {isArabic ? "تصدير" : "Export"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "إجمالي العناصر" : "Total Items"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {inventory.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "القيمة الإجمالية" : "Total Value"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getTotalValue().toLocaleString()} SAR
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "كمية منخفضة" : "Low Stock Items"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getLowStockItems().length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "صيانة مستحقة" : "Maintenance Due"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getMaintenanceDue().length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(getLowStockItems().length > 0 || getMaintenanceDue().length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {getLowStockItems().length > 0 && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-orange-800 dark:text-orange-200 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  {isArabic ? "تنبيه: كمية منخفضة" : "Alert: Low Stock"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getLowStockItems().map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-orange-800 dark:text-orange-200">
                        {isArabic ? item.nameAr : item.name}
                      </span>
                      <Badge className="bg-orange-200 text-orange-800">
                        {item.quantity} {isArabic ? item.unitAr : item.unit}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {getMaintenanceDue().length > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-red-800 dark:text-red-200 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  {isArabic ? "تنبيه: صيانة مستحقة" : "Alert: Maintenance Due"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getMaintenanceDue().map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-red-800 dark:text-red-200">
                        {isArabic ? item.nameAr : item.name}
                      </span>
                      <Badge className="bg-red-200 text-red-800">
                        {item.nextMaintenance}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">
            <Package className="w-4 h-4 mr-2" />
            {isArabic ? "المخزون" : "Inventory"}
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Wrench className="w-4 h-4 mr-2" />
            {isArabic ? "الصيانة" : "Maintenance"}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            {isArabic ? "التحليلات" : "Analytics"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={
                      isArabic ? "بحث في المخزون..." : "Search inventory..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isArabic ? "الفئة" : "Category"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isArabic ? "جميع الفئات" : "All Categories"}
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "الحالة" : "Status"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isArabic ? "جميع الحالات" : "All Status"}
                    </SelectItem>
                    <SelectItem value="available">
                      {isArabic ? "متاح" : "Available"}
                    </SelectItem>
                    <SelectItem value="in_use">
                      {isArabic ? "قيد الاستخدام" : "In Use"}
                    </SelectItem>
                    <SelectItem value="maintenance">
                      {isArabic ? "صيانة" : "Maintenance"}
                    </SelectItem>
                    <SelectItem value="out_of_stock">
                      {isArabic ? "نفذت الكمية" : "Out of Stock"}
                    </SelectItem>
                    <SelectItem value="damaged">
                      {isArabic ? "تالف" : "Damaged"}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder={isArabic ? "النوع" : "Type"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isArabic ? "جميع الأنواع" : "All Types"}
                    </SelectItem>
                    <SelectItem value="equipment">
                      {isArabic ? "معدات" : "Equipment"}
                    </SelectItem>
                    <SelectItem value="supplies">
                      {isArabic ? "مستلزمات" : "Supplies"}
                    </SelectItem>
                    <SelectItem value="consumables">
                      {isArabic ? "مواد استهلاكية" : "Consumables"}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {isArabic ? "مرشحات متقدمة" : "Advanced Filters"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        {item.type === "equipment" ? (
                          <Tool className="w-6 h-6 text-white" />
                        ) : item.type === "supplies" ? (
                          <Package className="w-6 h-6 text-white" />
                        ) : (
                          <ShoppingCart className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {isArabic ? item.nameAr : item.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.brand} {item.model}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {isArabic ? "الكمية:" : "Quantity:"}
                      </span>
                      <span
                        className={`font-medium ${item.quantity <= item.minQuantity ? "text-red-600" : "text-gray-900 dark:text-white"}`}
                      >
                        {item.quantity} {isArabic ? item.unitAr : item.unit}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {isArabic ? "الموقع:" : "Location:"}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {isArabic ? item.locationAr : item.location}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {isArabic ? "الحالة:" : "Condition:"}
                      </span>
                      {getConditionBadge(item.condition)}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {isArabic ? "القيمة:" : "Value:"}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {(item.currentValue * item.quantity).toLocaleString()}{" "}
                        SAR
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedItem(item)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {isArabic ? "عرض" : "View"}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      {isArabic ? "تعديل" : "Edit"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isArabic ? "إدارة الصيانة" : "Maintenance Management"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isArabic
                  ? "ستتم إضافة إدارة الصيانة قريباً"
                  : "Maintenance management will be added soon"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isArabic ? "تحليلات المخزون" : "Inventory Analytics"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isArabic
                  ? "ستتم إضافة التحليلات قريباً"
                  : "Analytics will be added soon"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Item Details Modal */}
      {selectedItem && (
        <Dialog
          open={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isArabic ? "تفاصيل العنصر" : "Item Details"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {isArabic ? selectedItem.nameAr : selectedItem.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedItem.brand} {selectedItem.model}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        {isArabic ? "الفئة" : "Category"}
                      </p>
                      <p className="text-sm font-medium">
                        {isArabic
                          ? selectedItem.categoryAr
                          : selectedItem.category}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        {isArabic ? "الرقم التسلسلي" : "Serial Number"}
                      </p>
                      <p className="text-sm font-medium">
                        {selectedItem.serialNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        {isArabic ? "تاريخ الشراء" : "Purchase Date"}
                      </p>
                      <p className="text-sm font-medium">
                        {selectedItem.purchaseDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        {isArabic ? "المورد" : "Supplier"}
                      </p>
                      <p className="text-sm font-medium">
                        {isArabic
                          ? selectedItem.supplierAr
                          : selectedItem.supplier}
                      </p>
                    </div>
                  </div>

                  {selectedItem.notes && (
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        {isArabic ? "ملاحظات" : "Notes"}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {isArabic ? selectedItem.notesAr : selectedItem.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedItem.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        {isArabic ? selectedItem.unitAr : selectedItem.unit}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {(
                          selectedItem.currentValue * selectedItem.quantity
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">SAR</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {isArabic ? "الحد الأدنى" : "Min Quantity"}
                      </span>
                      <span className="text-sm font-medium">
                        {selectedItem.minQuantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {isArabic ? "الحد الأقصى" : "Max Quantity"}
                      </span>
                      <span className="text-sm font-medium">
                        {selectedItem.maxQuantity}
                      </span>
                    </div>
                  </div>

                  {selectedItem.warrantyExpiry && (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        <strong>
                          {isArabic ? "انتهاء الضمان:" : "Warranty Expires:"}
                        </strong>{" "}
                        {selectedItem.warrantyExpiry}
                      </p>
                    </div>
                  )}

                  {selectedItem.nextMaintenance && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>
                          {isArabic ? "الصيانة القادمة:" : "Next Maintenance:"}
                        </strong>{" "}
                        {selectedItem.nextMaintenance}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
