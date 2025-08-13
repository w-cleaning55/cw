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
  Users,
  UserPlus,
  Calendar,
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  Award,
  TrendingUp,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Briefcase,
  Wrench,
  Shield,
  BarChart3,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  role: string;
  roleAr: string;
  department: string;
  departmentAr: string;
  status: "active" | "inactive" | "on_leave";
  hireDate: string;
  skills: string[];
  skillsAr: string[];
  rating: number;
  completedJobs: number;
  revenue: number;
  avatar: string;
  location: string;
  locationAr: string;
  salary: number;
  emergencyContact: string;
  nationalId: string;
  bankAccount: string;
  workSchedule: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  performance: {
    punctuality: number;
    quality: number;
    customerSatisfaction: number;
    efficiency: number;
  };
  certifications: {
    name: string;
    nameAr: string;
    issueDate: string;
    expiryDate: string;
    certified: boolean;
  }[];
}

interface Team {
  id: string;
  name: string;
  nameAr: string;
  leader: string;
  members: string[];
  specialization: string;
  specializationAr: string;
  status: "active" | "inactive";
  currentJobs: number;
  completedJobs: number;
  rating: number;
  equipment: string[];
  equipmentAr: string[];
  serviceAreas: string[];
  serviceAreasAr: string[];
}

export default function TeamManagementPage() {
  const { currentLanguage } = useTranslation();
  const isArabic = currentLanguage === "ar";
  const [activeTab, setActiveTab] = useState("employees");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showAddTeam, setShowAddTeam] = useState(false);

  // Sample data - In production, this would come from API
  useEffect(() => {
    const sampleEmployees: Employee[] = [
      {
        id: "emp001",
        name: "Ahmad Al-Hassan",
        nameAr: "أحمد الحسن",
        email: "ahmad.hassan@cleaningworld.sa",
        phone: "+966501234567",
        role: "Team Leader",
        roleAr: "قائد فريق",
        department: "Deep Cleaning",
        departmentAr: "التنظيف العميق",
        status: "active",
        hireDate: "2023-01-15",
        skills: ["Deep Cleaning", "Carpet Cleaning", "Team Management"],
        skillsAr: ["التنظيف العميق", "تنظيف السجاد", "إدارة الفريق"],
        rating: 4.8,
        completedJobs: 245,
        revenue: 125000,
        avatar: "👨‍🔧",
        location: "Al-Zahra District",
        locationAr: "حي الزهراء",
        salary: 8500,
        emergencyContact: "+966501234568",
        nationalId: "1234567890",
        bankAccount: "SA1234567890123456789",
        workSchedule: {
          monday: { start: "08:00", end: "16:00" },
          tuesday: { start: "08:00", end: "16:00" },
          wednesday: { start: "08:00", end: "16:00" },
          thursday: { start: "08:00", end: "16:00" },
          friday: { start: "14:00", end: "22:00" },
          saturday: { start: "08:00", end: "16:00" },
          sunday: { start: "08:00", end: "16:00" },
        },
        performance: {
          punctuality: 95,
          quality: 92,
          customerSatisfaction: 96,
          efficiency: 88,
        },
        certifications: [
          {
            name: "Professional Cleaning Certificate",
            nameAr: "شهادة التنظيف المهني",
            issueDate: "2023-01-01",
            expiryDate: "2025-01-01",
            certified: true,
          },
          {
            name: "Safety Training Certificate",
            nameAr: "شهادة التدريب على السلامة",
            issueDate: "2023-06-01",
            expiryDate: "2024-06-01",
            certified: true,
          },
        ],
      },
      {
        id: "emp002",
        name: "Fatima Al-Zahra",
        nameAr: "فاطمة الزهراء",
        email: "fatima.zahra@cleaningworld.sa",
        phone: "+966501234569",
        role: "Senior Technician",
        roleAr: "فني أول",
        department: "Carpet Cleaning",
        departmentAr: "تنظيف السجاد",
        status: "active",
        hireDate: "2023-03-20",
        skills: ["Carpet Cleaning", "Upholstery", "Stain Removal"],
        skillsAr: ["تنظيف السجاد", "المفروشات", "إزالة البقع"],
        rating: 4.9,
        completedJobs: 189,
        revenue: 95000,
        avatar: "👩‍🔧",
        location: "Al-Rawdah District",
        locationAr: "حي الروضة",
        salary: 7500,
        emergencyContact: "+966501234570",
        nationalId: "1234567891",
        bankAccount: "SA1234567890123456790",
        workSchedule: {
          monday: { start: "09:00", end: "17:00" },
          tuesday: { start: "09:00", end: "17:00" },
          wednesday: { start: "09:00", end: "17:00" },
          thursday: { start: "09:00", end: "17:00" },
          friday: { start: "15:00", end: "23:00" },
          saturday: { start: "09:00", end: "17:00" },
          sunday: { start: "09:00", end: "17:00" },
        },
        performance: {
          punctuality: 98,
          quality: 95,
          customerSatisfaction: 97,
          efficiency: 92,
        },
        certifications: [
          {
            name: "Carpet Care Specialist",
            nameAr: "أخصائي العناية بالسجاد",
            issueDate: "2023-04-01",
            expiryDate: "2025-04-01",
            certified: true,
          },
        ],
      },
    ];

    const sampleTeams: Team[] = [
      {
        id: "team001",
        name: "Alpha Deep Cleaning Team",
        nameAr: "فريق ألفا للتنظيف العميق",
        leader: "emp001",
        members: ["emp001", "emp002"],
        specialization: "Deep Cleaning & Sanitization",
        specializationAr: "التنظيف العميق والتعقيم",
        status: "active",
        currentJobs: 3,
        completedJobs: 156,
        rating: 4.8,
        equipment: ["Steam Cleaners", "Industrial Vacuum", "Pressure Washers"],
        equipmentAr: ["منظفات البخار", "مكنسة صناعية", "غسالات الضغط"],
        serviceAreas: ["Al-Zahra", "Al-Rawdah", "Al-Salamah"],
        serviceAreasAr: ["الزهراء", "الروضة", "السلامة"],
      },
    ];

    setEmployees(sampleEmployees);
    setTeams(sampleTeams);
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.nameAr.includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || emp.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      on_leave: "bg-yellow-100 text-yellow-800",
    };

    const labels = {
      active: isArabic ? "نشط" : "Active",
      inactive: isArabic ? "غير نشط" : "Inactive",
      on_leave: isArabic ? "في إجازة" : "On Leave",
    };

    return (
      <Badge className={`${colors[status as keyof typeof colors]} border-0`}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const departments = Array.from(
    new Set(employees.map((emp) => emp.department)),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isArabic ? "إدارة الفريق" : "Team Management"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isArabic
              ? "إدارة الموظفين والفرق والأداء"
              : "Manage employees, teams, and performance"}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="w-4 h-4 mr-2" />
                {isArabic ? "إضافة موظف" : "Add Employee"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {isArabic ? "إضافة موظف جديد" : "Add New Employee"}
                </DialogTitle>
              </DialogHeader>
              {/* Add Employee Form will be implemented here */}
              <div className="p-4 text-center">
                <p className="text-gray-600">
                  {isArabic
                    ? "نموذج إضافة موظف سيتم تطبيقه هنا"
                    : "Employee form will be implemented here"}
                </p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddTeam} onOpenChange={setShowAddTeam}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                {isArabic ? "إنشاء فريق" : "Create Team"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isArabic ? "إنشاء فريق جديد" : "Create New Team"}
                </DialogTitle>
              </DialogHeader>
              {/* Add Team Form will be implemented here */}
              <div className="p-4 text-center">
                <p className="text-gray-600">
                  {isArabic
                    ? "نموذج إنشاء فريق سيتم تطبيقه هنا"
                    : "Team creation form will be implemented here"}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "إجمالي الموظفين" : "Total Employees"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {employees.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "الموظفون النشطون" : "Active Employees"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {employees.filter((emp) => emp.status === "active").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "إجمالي الفرق" : "Total Teams"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {teams.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {isArabic ? "متوسط التقييم" : "Average Rating"}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {(
                    employees.reduce((sum, emp) => sum + emp.rating, 0) /
                    employees.length
                  ).toFixed(1)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="employees">
            <Users className="w-4 h-4 mr-2" />
            {isArabic ? "الموظفون" : "Employees"}
          </TabsTrigger>
          <TabsTrigger value="teams">
            <Briefcase className="w-4 h-4 mr-2" />
            {isArabic ? "الفرق" : "Teams"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={
                      isArabic ? "بحث عن موظف..." : "Search employees..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isArabic ? "حالة الموظف" : "Employee Status"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isArabic ? "جميع الحالات" : "All Status"}
                    </SelectItem>
                    <SelectItem value="active">
                      {isArabic ? "نشط" : "Active"}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {isArabic ? "غير نشط" : "Inactive"}
                    </SelectItem>
                    <SelectItem value="on_leave">
                      {isArabic ? "في إجازة" : "On Leave"}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isArabic ? "القسم" : "Department"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {isArabic ? "جميع الأقسام" : "All Departments"}
                    </SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  {isArabic ? "مرشحات متقدمة" : "Advanced Filters"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card
                key={employee.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                        {employee.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {isArabic ? employee.nameAr : employee.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isArabic ? employee.roleAr : employee.role}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(employee.status)}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      {employee.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      {employee.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {isArabic ? employee.locationAr : employee.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">
                          {employee.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {isArabic ? "التقييم" : "Rating"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.completedJobs}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {isArabic ? "المهام" : "Jobs"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {(employee.revenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {isArabic ? "الإيرادات" : "Revenue"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedEmployee(employee)}
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

        <TabsContent value="teams" className="space-y-4">
          {/* Teams will be implemented here */}
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {isArabic ? "إدارة الفرق" : "Team Management"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isArabic
                  ? "ستتم إضافة إدارة الفرق قريباً"
                  : "Team management will be added soon"}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <Dialog
          open={!!selectedEmployee}
          onOpenChange={() => setSelectedEmployee(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isArabic ? "تفاصيل الموظف" : "Employee Details"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl">
                      {selectedEmployee.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isArabic
                          ? selectedEmployee.nameAr
                          : selectedEmployee.name}
                      </h2>
                      <p className="text-lg text-gray-600 dark:text-gray-400">
                        {isArabic
                          ? selectedEmployee.roleAr
                          : selectedEmployee.role}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isArabic
                          ? selectedEmployee.departmentAr
                          : selectedEmployee.department}
                      </p>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        {isArabic ? "مؤشرات الأداء" : "Performance Metrics"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {isArabic ? "الالتزام بالمواعيد" : "Punctuality"}
                            </span>
                            <span className="text-sm font-medium">
                              {selectedEmployee.performance.punctuality}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width: `${selectedEmployee.performance.punctuality}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {isArabic ? "جودة العمل" : "Quality"}
                            </span>
                            <span className="text-sm font-medium">
                              {selectedEmployee.performance.quality}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${selectedEmployee.performance.quality}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {isArabic
                                ? "رضا العملاء"
                                : "Customer Satisfaction"}
                            </span>
                            <span className="text-sm font-medium">
                              {
                                selectedEmployee.performance
                                  .customerSatisfaction
                              }
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-600 h-2 rounded-full"
                              style={{
                                width: `${selectedEmployee.performance.customerSatisfaction}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {isArabic ? "الكفاءة" : "Efficiency"}
                            </span>
                            <span className="text-sm font-medium">
                              {selectedEmployee.performance.efficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{
                                width: `${selectedEmployee.performance.efficiency}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        {isArabic ? "المهارات" : "Skills"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(isArabic
                          ? selectedEmployee.skillsAr
                          : selectedEmployee.skills
                        ).map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {isArabic ? "معلومات الاتصال" : "Contact Information"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          {isArabic ? "البريد الإلكتروني" : "Email"}
                        </p>
                        <p className="text-sm font-medium">
                          {selectedEmployee.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          {isArabic ? "رقم الهاتف" : "Phone"}
                        </p>
                        <p className="text-sm font-medium">
                          {selectedEmployee.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          {isArabic ? "هاتف الطوارئ" : "Emergency Contact"}
                        </p>
                        <p className="text-sm font-medium">
                          {selectedEmployee.emergencyContact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">
                        {isArabic ? "معلومات العمل" : "Work Information"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          {isArabic ? "تاريخ التوظيف" : "Hire Date"}
                        </p>
                        <p className="text-sm font-medium">
                          {selectedEmployee.hireDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          {isArabic ? "الراتب" : "Salary"}
                        </p>
                        <p className="text-sm font-medium">
                          {selectedEmployee.salary.toLocaleString()} SAR
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          {isArabic ? "رقم الهوية" : "National ID"}
                        </p>
                        <p className="text-sm font-medium">
                          {selectedEmployee.nationalId}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {isArabic ? "الشهادات" : "Certifications"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedEmployee.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-green-500 pl-3"
                        >
                          <p className="text-sm font-medium">
                            {isArabic ? cert.nameAr : cert.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {isArabic ? "صالحة حتى" : "Valid until"}:{" "}
                            {cert.expiryDate}
                          </p>
                          {cert.certified && (
                            <Badge className="mt-1 text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {isArabic ? "مصدقة" : "Certified"}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
