import { RequestHandler } from "express";
import { dataManager } from "../utils/dataManager";

interface BookingData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  amount: number;
  status: string;
  scheduledDate: string;
  location: string;
  createdAt: string;
}

interface CustomerData {
  id: string;
  name: string;
  phone: string;
  email: string;
  registrationDate: string;
  totalBookings: number;
  totalSpent: number;
  status: string;
}

// Generate realistic dashboard statistics
export const handleGetDashboardStats: RequestHandler = async (req, res) => {
  try {
    // Get current date for calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Load real data from JSON files
    const servicesData = await dataManager.readData('services');
    const usersData = await dataManager.readData('users');
    
    // Generate realistic bookings data
    const recentBookings = generateRecentBookings();
    const customers = generateCustomerData();
    
    // Calculate overview statistics
    const totalCustomers = customers.length;
    const activeBookings = recentBookings.filter(b => 
      b.status === 'confirmed' || b.status === 'in_progress'
    ).length;
    
    const completedBookings = recentBookings.filter(b => b.status === 'completed').length;
    const monthlyRevenue = recentBookings
      .filter(b => new Date(b.scheduledDate).getMonth() === currentMonth)
      .reduce((sum, b) => sum + b.amount, 0);
    
    // Calculate growth percentages (simulate real business metrics)
    const revenueGrowth = Math.round((Math.random() * 30 + 5) * 100) / 100; // 5-35%
    const bookingGrowth = Math.round((Math.random() * 25 + 8) * 100) / 100; // 8-33%
    const satisfactionGrowth = Math.round((Math.random() * 5 + 2) * 100) / 100; // 2-7%
    
    // Service performance based on real services data
    const servicePerformance = servicesData?.services?.map((service: any) => ({
      serviceName: service.title,
      bookingsCount: Math.floor(Math.random() * 50 + 10),
      revenue: Math.floor(Math.random() * 50000 + 10000),
      averageRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0
      completionRate: Math.round((Math.random() * 20 + 80) * 100) / 100 // 80-100%
    })) || [];

    // System metrics (realistic for a cleaning business)
    const systemMetrics = {
      serverUptime: Math.round((Math.random() * 2 + 98) * 100) / 100, // 98-100%
      responseTime: Math.floor(Math.random() * 100 + 50), // 50-150ms
      activeUsers: Math.floor(Math.random() * 20 + 5), // 5-25 concurrent users
      errorRate: Math.round((Math.random() * 0.5) * 100) / 100 // 0-0.5%
    };

    const dashboardStats = {
      overview: {
        totalCustomers,
        activeBookings,
        monthlyRevenue,
        completedJobs: completedBookings,
        customerSatisfaction: 96, // High satisfaction for cleaning business
        revenueGrowth,
        bookingGrowth,
        satisfactionGrowth
      },
      recentBookings: recentBookings.slice(0, 6), // Show last 6 bookings
      servicePerformance: servicePerformance.slice(0, 5), // Top 5 services
      systemMetrics
    };

    res.json(dashboardStats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      error: 'Failed to load dashboard statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Generate realistic recent bookings
function generateRecentBookings(): BookingData[] {
  const customerNames = [
    'أحمد محمد السعيد', 'فاطمة عبدالله', 'محمد علي الزهراني', 'نورا حسن القحطاني',
    'عبدالرحمن خالد', 'سارة أحمد العتيبي', 'يوسف محمد الدوسري', 'مريم عبدالعزيز',
    'عبدالله سعد المطيري', 'خديجة محمد الشهري', 'حسام عبدالرحمن', 'آمنة سالم النعيمي'
  ];
  
  const services = [
    'تنظيف وتعقيم السجاد والستائر',
    'تنظيف وتعقيم المجالس والكنب', 
    'تنظيف وتلميع الأرضيات وجلي الرخام',
    'تنظيف وعزل خزانات المياه',
    'تنظيف المطاعم والمقاهي',
    'مكافحة الحشرات والقوارض',
    'خدمة التعقيم العميق'
  ];
  
  const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الطائف'];
  const statuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];
  const statusWeights = [0.15, 0.25, 0.20, 0.35, 0.05]; // More completed bookings
  
  const bookings: BookingData[] = [];
  
  for (let i = 0; i < 25; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30)); // Last 30 days
    
    // Weighted random status selection
    let randomNum = Math.random();
    let selectedStatus = statuses[0];
    let cumulative = 0;
    
    for (let j = 0; j < statuses.length; j++) {
      cumulative += statusWeights[j];
      if (randomNum <= cumulative) {
        selectedStatus = statuses[j];
        break;
      }
    }
    
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    
    bookings.push({
      id: `booking_${i + 1}`,
      customerName,
      customerPhone: `+966 5${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
      customerEmail: `${customerName.split(' ')[0].toLowerCase()}@email.com`,
      service,
      amount: Math.floor(Math.random() * 800 + 200), // 200-1000 SAR
      status: selectedStatus,
      scheduledDate: randomDate.toISOString(),
      location: city,
      createdAt: new Date(randomDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  return bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Generate realistic customer data
function generateCustomerData(): CustomerData[] {
  const customerNames = [
    'أحمد محمد السعيد', 'فاطمة عبدالله الزهراني', 'محمد علي القحطاني', 'نورا حسن العتيبي',
    'عبدالرحمن خالد المطيري', 'سارة أحمد الدوسري', 'يوسف محمد الشهري', 'مريم عبدالعزيز النعيمي',
    'عبدالله سعد الحربي', 'خديجة محمد الغامدي', 'حسام عبدالرحمن القرني', 'آمنة سالم البلوي',
    'طارق عبدالله العمري', 'هند محمد الراشد', 'سعد أحمد الفهد', 'لينا حسن الخطيب'
  ];
  
  const customers: CustomerData[] = [];
  
  for (let i = 0; i < 40; i++) {
    const registrationDate = new Date();
    registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 365)); // Last year
    
    const totalBookings = Math.floor(Math.random() * 15 + 1); // 1-15 bookings
    const avgBookingValue = Math.floor(Math.random() * 600 + 300); // 300-900 SAR average
    const totalSpent = totalBookings * avgBookingValue;
    
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    
    customers.push({
      id: `customer_${i + 1}`,
      name: customerName,
      phone: `+966 5${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 1000000).toString().padStart(7, '0')}`,
      email: `${customerName.split(' ')[0].toLowerCase()}${i}@email.com`,
      registrationDate: registrationDate.toISOString(),
      totalBookings,
      totalSpent,
      status: Math.random() > 0.1 ? 'active' : 'inactive' // 90% active customers
    });
  }
  
  return customers;
}

// Handle getting all bookings for booking management
export const handleGetBookings: RequestHandler = async (req, res) => {
  try {
    const bookings = generateRecentBookings();
    
    // Add additional fields for booking management
    const enrichedBookings = bookings.map(booking => ({
      ...booking,
      scheduledTime: `${Math.floor(Math.random() * 12 + 8)}:${Math.random() > 0.5 ? '00' : '30'}`,
      address: `حي ${Math.floor(Math.random() * 20 + 1)}، ${booking.location}`,
      notes: Math.random() > 0.7 ? 'ملاحظة خاصة من العميل' : undefined,
      assignedTechnician: Math.random() > 0.5 ? 'خالد المطيري' : 'أحمد السعيد',
      updatedAt: new Date().toISOString()
    }));

    res.json({ 
      bookings: enrichedBookings,
      total: enrichedBookings.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
};

// Handle getting all customers for customer management
export const handleGetCustomers: RequestHandler = async (req, res) => {
  try {
    const customers = generateCustomerData();
    
    // Add additional fields for customer management
    const enrichedCustomers = customers.map(customer => ({
      ...customer,
      address: `شارع ${Math.floor(Math.random() * 50 + 1)}، حي ${Math.floor(Math.random() * 20 + 1)}`,
      city: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة'][Math.floor(Math.random() * 5)],
      lastBookingDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      averageRating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5-5.0
      notes: Math.random() > 0.8 ? 'عميل مميز - خدمة دورية' : undefined,
      preferredServices: ['تنظيف السجاد', 'تنظيف المجالس']
    }));

    res.json({ 
      customers: enrichedCustomers,
      total: enrichedCustomers.length,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to load customers' });
  }
};

// Handle updating booking status
export const handleUpdateBookingStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // In a real app, this would update the database
    // For now, we'll just simulate success
    res.json({ 
      success: true, 
      message: 'Booking status updated successfully',
      bookingId: id,
      newStatus: status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// Handle deleting booking
export const handleDeleteBooking: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, this would delete from database
    // For now, we'll just simulate success
    res.json({ 
      success: true, 
      message: 'Booking deleted successfully',
      bookingId: id,
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

// Handle updating customer
export const handleUpdateCustomer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // In a real app, this would update the database
    // For now, we'll just simulate success
    res.json({ 
      success: true, 
      message: 'Customer updated successfully',
      customerId: id,
      updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

// Handle deleting customer
export const handleDeleteCustomer: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real app, this would delete from database
    // For now, we'll just simulate success
    res.json({ 
      success: true, 
      message: 'Customer deleted successfully',
      customerId: id,
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};
