import SoftUIDashboard from "../../../components/dashboard/SoftUIDashboard";
import SoftUICard from "../../../components/dashboard/SoftUICard";
import SoftUIButton from "../../../components/dashboard/SoftUIButton";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function BookingsPage() {
  const bookings = [
    {
      id: 1,
      customerName: "أحمد محمد الأحمدي",
      service: "تنظيف ��نزل",
      date: "2024-01-20",
      time: "10:00 صباحاً",
      location: "الرياض - حي الملز",
      phone: "0501234567",
      status: "مؤكد",
      amount: 450,
      notes: "تنظيف شامل للمنزل مع التعقيم",
    },
    {
      id: 2,
      customerName: "فاطمة عبدالله",
      service: "تنظيف مكتب",
      date: "2024-01-20",
      time: "2:00 مساءً",
      location: "جدة - حي الحمراء",
      phone: "0509876543",
      status: "في الانتظار",
      amount: 320,
      notes: "تنظيف دوري أسبوعي",
    },
    {
      id: 3,
      customerName: "محمد العتيبي",
      service: "تنظيف سجاد",
      date: "2024-01-21",
      time: "9:00 صباحاً",
      location: "الدمام - حي الشاطئ",
      phone: "0505555555",
      status: "مكتمل",
      amount: 280,
      notes: "تنظيف سجاد غرفة المعيشة والصالة",
    },
    {
      id: 4,
      customerName: "نورا السالم",
      service: "جلي رخام",
      date: "2024-01-21",
      time: "11:00 صباحاً",
      location: "الرياض - حي النرجس",
      phone: "0502222222",
      status: "ملغ��",
      amount: 0,
      notes: "تم الإلغاء بطلب العميل",
    },
    {
      id: 5,
      customerName: "خالد المطيري",
      service: "تنظيف خزان مياه",
      date: "2024-01-22",
      time: "8:00 صباحاً",
      location: "مكة - حي العزيزية",
      phone: "0507777777",
      status: "مؤكد",
      amount: 380,
      notes: "تنظيف وتعقيم خزان علوي",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مؤكد":
        return "from-green-500 to-emerald-500";
      case "في الانتظار":
        return "from-yellow-500 to-orange-500";
      case "مكتمل":
        return "from-blue-500 to-cyan-500";
      case "ملغي":
        return "from-red-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "مؤكد":
        return <CheckCircle className="w-4 h-4" />;
      case "في الانتظار":
        return <AlertCircle className="w-4 h-4" />;
      case "مكتمل":
        return <CheckCircle className="w-4 h-4" />;
      case "ملغي":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const todayBookings = bookings.filter((b) => b.date === "2024-01-20").length;
  const pendingBookings = bookings.filter(
    (b) => b.status === "في الانتظار",
  ).length;
  const completedBookings = bookings.filter((b) => b.status === "مكتمل").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "مكتمل")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <SoftUIDashboard>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl text-white">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {todayBookings}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">مواعيد اليوم</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl text-white">
                <Clock className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {pendingBookings}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">في الانتظار</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {completedBookings}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">مكتملة</div>
            </div>
          </SoftUICard>

          <SoftUICard variant="glass">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl text-white">
                💰
              </div>
              <div className="text-lg font-bold text-purple-600">
                {totalRevenue.toLocaleString()}
              </div>
            </div>
            <div className="text-right" dir="rtl">
              <div className="text-gray-600 text-sm">إجمالي الإيرادات</div>
            </div>
          </SoftUICard>
        </div>

        {/* Quick Actions */}
        <SoftUICard variant="gradient">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900" dir="rtl">
              إجراءات سريعة
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <SoftUIButton
              variant="primary"
              icon={<Calendar className="w-4 h-4" />}
            >
              موعد جديد
            </SoftUIButton>
            <SoftUIButton
              variant="secondary"
              icon={<User className="w-4 h-4" />}
            >
              بحث عن عميل
            </SoftUIButton>
            <SoftUIButton variant="glass" icon={<Clock className="w-4 h-4" />}>
              جدولة تلقائية
            </SoftUIButton>
          </div>
        </SoftUICard>

        {/* Bookings List */}
        <SoftUICard variant="glass">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900" dir="rtl">
              قائمة المواعيد
            </h3>
            <SoftUIButton variant="outline" size="sm">
              عرض الكل
            </SoftUIButton>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-6 bg-white/30 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/40 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {booking.customerName.charAt(0)}
                      </div>
                      <div className="text-right" dir="rtl">
                        <div className="font-semibold text-gray-900">
                          {booking.customerName}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {booking.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service & Location */}
                  <div className="space-y-3 text-right" dir="rtl">
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.service}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 justify-end">
                        <span>{booking.location}</span>
                        <MapPin className="w-3 h-3" />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{booking.notes}</div>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2 text-center">
                    <div className="font-medium text-gray-900">
                      {booking.date}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1 justify-center">
                      <Clock className="w-4 h-4" />
                      {booking.time}
                    </div>
                    {booking.amount > 0 && (
                      <div className="text-lg font-bold text-green-600">
                        {booking.amount} ريال
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium bg-gradient-to-r ${getStatusColor(booking.status)}`}
                      >
                        {getStatusIcon(booking.status)}
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex justify-center gap-2">
                      <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                        👁️
                      </button>
                      <button className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors">
                        ✏️
                      </button>
                      <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                        ✅
                      </button>
                      <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        ❌
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SoftUICard>
      </div>
    </SoftUIDashboard>
  );
}
