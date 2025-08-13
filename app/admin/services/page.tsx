import SoftUIDashboard from "../../../components/dashboard/SoftUIDashboard";
import SoftUICard from "../../../components/dashboard/SoftUICard";
import SoftUIButton from "../../../components/dashboard/SoftUIButton";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Star,
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      name: "تنظيف المنازل والفلل",
      description: "خدمة تنظيف شاملة للمنازل والفلل مع ضمان الجودة",
      price: "350-800",
      duration: "2-5 ساعات",
      category: "سكني",
      bookingsCount: 156,
      revenue: 78400,
      rating: 4.9,
      status: "نشط",
      icon: "🏠",
    },
    {
      id: 2,
      name: "تنظيف المكاتب والشركات",
      description: "حلول تنظيف احترافية للمكاتب والمباني التجارية",
      price: "200-600",
      duration: "1-4 ساعات",
      category: "تجاري",
      bookingsCount: 89,
      revenue: 45300,
      rating: 4.8,
      status: "نشط",
      icon: "🏢",
    },
    {
      id: 3,
      name: "تنظيف السجاد والستائر",
      description: "تنظيف وتعقيم السجاد والستائر بأحدث التقنيات",
      price: "150-400",
      duration: "1-3 ساعات",
      category: "متخصص",
      bookingsCount: 67,
      revenue: 28900,
      rating: 4.7,
      status: "نشط",
      icon: "🧽",
    },
    {
      id: 4,
      name: "جلي وتلميع الرخام",
      description: "تلميع وصيانة الأرضيات الرخامية والبلاط",
      price: "300-700",
      duration: "2-4 ساعات",
      category: "متخصص",
      bookingsCount: 34,
      revenue: 18600,
      rating: 4.8,
      status: "نشط",
      icon: "✨",
    },
    {
      id: 5,
      name: "تنظيف خزانات المياه",
      description: "تنظيف وتعقيم خزانات المياه وفقاً للمعايير الصحية",
      price: "400-600",
      duration: "3-5 ساعات",
      category: "متخصص",
      bookingsCount: 28,
      revenue: 14800,
      rating: 4.9,
      status: "نشط",
      icon: "💧",
    },
    {
      id: 6,
      name: "مكافحة الحشرات",
      description: "خدمات مكافحة الحشرات والقوارض بمواد آمنة",
      price: "250-500",
      duration: "1-3 ساعات",
      category: "متخصص",
      bookingsCount: 45,
      revenue: 16750,
      status: "مؤقت",
      rating: 4.6,
      icon: "🛡️",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "سكني":
        return "from-blue-500 to-cyan-500";
      case "تجاري":
        return "from-green-500 to-emerald-500";
      case "متخصص":
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "نشط":
        return "bg-green-100 text-green-700";
      case "مؤقت":
        return "bg-yellow-100 text-yellow-700";
      case "متوقف":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status === "نشط").length;
  const totalBookings = services.reduce((sum, s) => sum + s.bookingsCount, 0);
  const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <SoftUIDashboard>
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900" dir="rtl">
            إدارة الخدمات
          </h1>
          <SoftUIButton variant="primary" icon={<Plus className="w-5 h-5" />}>
            إضافة خدمة جديدة
          </SoftUIButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white">
                📋
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {totalServices}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">إجمالي الخدمات</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white">
                ✅
              </div>
              <div className="text-2xl font-bold text-green-600">
                {activeServices}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">خدمات نشطة</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {totalBookings}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">إجمالي الحجوزات</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-xl font-bold text-orange-600">
                {totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">إجمالي الإيرادات</div>
            </div>
          </SoftUICard>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <SoftUICard
              key={service.id}
              variant="glass"
              className="relative overflow-hidden group"
            >
              {/* Background decoration */}
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${getCategoryColor(service.category)} opacity-10 rounded-bl-3xl`}
              ></div>

              <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-r ${getCategoryColor(service.category)} text-white shadow-lg`}
                    >
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <div>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                      >
                        {service.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {service.rating}
                    </span>
                  </div>
                </div>

                {/* Service Info */}
                <div className="space-y-3 mb-6">
                  <h3 className="text-lg font-bold text-gray-900" dir="rtl">
                    {service.name}
                  </h3>
                  <p
                    className="text-sm text-gray-600 leading-relaxed"
                    dir="rtl"
                  >
                    {service.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-white/30 rounded-lg backdrop-blur-sm">
                      <div className="font-medium text-gray-900">
                        {service.price} ريال
                      </div>
                      <div className="text-gray-600" dir="rtl">
                        السعر
                      </div>
                    </div>
                    <div className="text-center p-2 bg-white/30 rounded-lg backdrop-blur-sm">
                      <div className="font-medium text-gray-900">
                        {service.duration}
                      </div>
                      <div className="text-gray-600" dir="rtl">
                        المدة
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="font-bold">{service.bookingsCount}</span>
                    </div>
                    <div className="text-xs text-gray-600" dir="rtl">
                      حجز
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-bold">
                        {service.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600" dir="rtl">
                      ريال
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1 text-sm">
                    <Eye className="w-4 h-4" />
                    عرض
                  </button>
                  <button className="flex-1 p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors flex items-center justify-center gap-1 text-sm">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </SoftUICard>
          ))}
        </div>

        {/* Performance Summary */}
        <SoftUICard variant="gradient">
          <h3
            className="text-xl font-bold text-gray-900 mb-6 text-center"
            dir="rtl"
          >
            ملخص أداء الخدمات
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                🏆
              </div>
              <div className="text-lg font-bold text-gray-900">
                تنظيف المنازل
              </div>
              <div className="text-sm text-gray-600" dir="rtl">
                الخدمة الأكثر طلباً
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                ⭐
              </div>
              <div className="text-lg font-bold text-gray-900">4.9/5</div>
              <div className="text-sm text-gray-600" dir="rtl">
                متوسط التقييم العام
              </div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                📈
              </div>
              <div className="text-lg font-bold text-gray-900">+18%</div>
              <div className="text-sm text-gray-600" dir="rtl">
                نمو هذا الشهر
              </div>
            </div>
          </div>
        </SoftUICard>
      </div>
    </SoftUIDashboard>
  );
}
