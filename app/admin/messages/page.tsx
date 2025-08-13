import SoftUIDashboard from "../../../components/dashboard/SoftUIDashboard";
import SoftUICard from "../../../components/dashboard/SoftUICard";
import SoftUIButton from "../../../components/dashboard/SoftUIButton";
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Filter,
  Archive,
  Star,
} from "lucide-react";

export default function MessagesPage() {
  const conversations = [
    {
      id: 1,
      customerName: "أحمد محمد الأحمدي",
      lastMessage: "شكراً لكم على الخدمة الممتازة، المنزل أصبح نظيفاً تماماً",
      timestamp: "قبل 5 دقائق",
      unread: false,
      avatar: "أ",
      status: "نشط",
      type: "عام",
    },
    {
      id: 2,
      customerName: "فاطمة عبدالله",
      lastMessage: "هل يمكن تغيير موعد التنظيف إلى الغد؟",
      timestamp: "قبل 15 دقيقة",
      unread: true,
      avatar: "ف",
      status: "في الانتظار",
      type: "استفسار",
    },
    {
      id: 3,
      customerName: "محمد العتيبي",
      lastMessage: "أريد حجز خدمة تنظيف سجاد عاجلة",
      timestamp: "قبل 30 دقيقة",
      unread: true,
      avatar: "م",
      status: "عاجل",
      type: "حجز",
    },
    {
      id: 4,
      customerName: "نورا السالم",
      lastMessage: "تم استلام الدفعة، شكراً لكم",
      timestamp: "قبل ساعة",
      unread: false,
      avatar: "ن",
      status: "مكتمل",
      type: "دفع",
    },
    {
      id: 5,
      customerName: "خالد المطيري",
      lastMessage: "الفريق وصل في الوقت المحدد، خدمة احترافية",
      timestamp: "قبل ساعتين",
      unread: false,
      avatar: "خ",
      status: "مراجعة",
      type: "تقييم",
    },
  ];

  const currentChat = conversations[1]; // فاطمة عبدالله

  const chatMessages = [
    {
      id: 1,
      sender: "customer",
      message: "السلام عليكم، أريد حجز موعد لتنظيف المكتب",
      timestamp: "10:30 صباحاً",
      read: true,
    },
    {
      id: 2,
      sender: "admin",
      message:
        "وعليكم السلام ورحمة الله، أهلاً وسهلاً بك. يمكننا ترتيب موعد مناسب لك",
      timestamp: "10:32 صباحاً",
      read: true,
    },
    {
      id: 3,
      sender: "customer",
      message: "ممتاز، ما هي الأوقات المتاحة لهذا الأسبوع؟",
      timestamp: "10:35 صباحاً",
      read: true,
    },
    {
      id: 4,
      sender: "admin",
      message:
        "لدينا مواعيد متاحة يوم الثلاثاء من 9-12 صباحاً ويوم الخميس من 2-5 مساءً",
      timestamp: "10:37 صباحاً",
      read: true,
    },
    {
      id: 5,
      sender: "customer",
      message: "هل يمكن تغيير موعد التنظيف إلى الغد؟",
      timestamp: "11:15 صباحاً",
      read: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "عاجل":
        return "bg-red-500";
      case "في الانتظار":
        return "bg-yellow-500";
      case "نشط":
        return "bg-green-500";
      case "مكتمل":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "حجز":
        return "📅";
      case "دفع":
        return "💰";
      case "تقييم":
        return "⭐";
      case "استفسار":
        return "❓";
      default:
        return "💬";
    }
  };

  return (
    <SoftUIDashboard>
      <div className="h-[calc(100vh-200px)] flex gap-6">
        {/* Conversations List */}
        <div className="w-1/3">
          <SoftUICard
            variant="glass"
            className="h-full flex flex-col"
            padding="md"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900" dir="rtl">
                المحادثات
              </h3>
              <div className="flex gap-2">
                <button className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                  <Search className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                  <Filter className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المحادثات..."
                className="w-full pr-10 pl-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-right"
                dir="rtl"
              />
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    conversation.id === currentChat.id
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-md"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {conversation.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(conversation.status)} rounded-full border-2 border-white`}
                      ></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div
                          className="font-medium text-gray-900 truncate"
                          dir="rtl"
                        >
                          {conversation.customerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">
                            {getTypeIcon(conversation.type)}
                          </span>
                          {conversation.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 truncate" dir="rtl">
                        {conversation.lastMessage}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {conversation.timestamp}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(conversation.status)}`}
                        >
                          {conversation.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SoftUICard>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          <SoftUICard
            variant="glass"
            className="h-full flex flex-col"
            padding="md"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentChat.avatar}
                </div>
                <div className="text-right" dir="rtl">
                  <div className="font-semibold text-gray-900">
                    {currentChat.customerName}
                  </div>
                  <div className="text-sm text-gray-500">متصل الآن</div>
                </div>
              </div>

              <div className="flex gap-2">
                <SoftUIButton
                  variant="outline"
                  size="sm"
                  icon={<Phone className="w-4 h-4" />}
                >
                  اتصال
                </SoftUIButton>
                <SoftUIButton
                  variant="outline"
                  size="sm"
                  icon={<Video className="w-4 h-4" />}
                >
                  فيديو
                </SoftUIButton>
                <button className="p-2 rounded-lg hover:bg-white/30 transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "admin" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[70%] ${
                      message.sender === "admin"
                        ? "bg-white/60 text-gray-900"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                    } px-4 py-3 rounded-2xl backdrop-blur-sm`}
                  >
                    <p className="text-sm" dir="rtl">
                      {message.message}
                    </p>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === "admin"
                          ? "text-gray-500"
                          : "text-blue-100"
                      }`}
                    >
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="pt-4 border-t border-white/20">
              <div className="flex gap-3">
                <div className="flex gap-2">
                  <button className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    📎
                  </button>
                  <button className="p-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                    😊
                  </button>
                </div>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="اكتب رسالتك..."
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-right"
                    dir="rtl"
                  />
                </div>

                <SoftUIButton
                  variant="primary"
                  icon={<Send className="w-4 h-4" />}
                >
                  إرسال
                </SoftUIButton>
              </div>
            </div>
          </SoftUICard>
        </div>

        {/* Quick Actions */}
        <div className="w-64">
          <SoftUICard variant="glass" padding="md">
            <h4 className="font-bold text-gray-900 mb-4" dir="rtl">
              إجراءات سريعة
            </h4>

            <div className="space-y-3">
              <SoftUIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                icon={<Star className="w-4 h-4" />}
              >
                <span dir="rtl">إضافة لمميز</span>
              </SoftUIButton>

              <SoftUIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                icon={<Archive className="w-4 h-4" />}
              >
                <span dir="rtl">أرشفة المحادثة</span>
              </SoftUIButton>

              <SoftUIButton
                variant="outline"
                size="sm"
                className="w-full justify-start"
                icon={<Phone className="w-4 h-4" />}
              >
                <span dir="rtl">بدء مكالمة</span>
              </SoftUIButton>
            </div>

            {/* Customer Info */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <h5 className="font-medium text-gray-900 mb-3" dir="rtl">
                معلومات العميل
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between" dir="rtl">
                  <span className="text-gray-600">الاسم:</span>
                  <span className="text-gray-900">
                    {currentChat.customerName}
                  </span>
                </div>
                <div className="flex justify-between" dir="rtl">
                  <span className="text-gray-600">الحالة:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColor(currentChat.status)}`}
                  >
                    {currentChat.status}
                  </span>
                </div>
                <div className="flex justify-between" dir="rtl">
                  <span className="text-gray-600">النوع:</span>
                  <span className="text-gray-900">{currentChat.type}</span>
                </div>
              </div>
            </div>
          </SoftUICard>
        </div>
      </div>
    </SoftUIDashboard>
  );
}
