import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

interface AnalyticsData {
  overview: {
    totalBookings: number;
    totalRevenue: number;
    activeCustomers: number;
    completedServices: number;
    averageRating: number;
    growthRate: number;
  };
  monthlyData: Array<{
    month: string;
    bookings: number;
    revenue: number;
    customers: number;
  }>;
  serviceStats: Array<{
    service: string;
    count: number;
    revenue: number;
    avgRating: number;
  }>;
  customerStats: {
    new: number;
    returning: number;
    vip: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'booking' | 'payment' | 'review' | 'customer';
    message: string;
    time: string;
    amount?: number;
  }>;
  topServices: Array<{
    name: string;
    bookings: number;
    revenue: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  lastUpdated: string;
}

function getAnalyticsData(): AnalyticsData {
  return {
    overview: {
      totalBookings: 1247,
      totalRevenue: 245680,
      activeCustomers: 892,
      completedServices: 1180,
      averageRating: 4.8,
      growthRate: 12.5
    },
    monthlyData: [
      { month: 'يناير', bookings: 145, revenue: 28900, customers: 98 },
      { month: 'فبراير', bookings: 132, revenue: 26400, customers: 87 },
      { month: 'مارس', bookings: 167, revenue: 33450, customers: 112 },
      { month: 'أبريل', bookings: 189, revenue: 37800, customers: 125 },
      { month: 'مايو', bookings: 203, revenue: 40600, customers: 134 },
      { month: 'يونيو', bookings: 178, revenue: 35600, customers: 119 },
      { month: 'يوليو', bookings: 156, revenue: 31200, customers: 103 },
      { month: 'أغسطس', bookings: 143, revenue: 28600, customers: 95 },
      { month: 'سبتمبر', bookings: 198, revenue: 39600, customers: 128 },
      { month: 'أكتوبر', bookings: 221, revenue: 44200, customers: 145 },
      { month: 'نوفمبر', bookings: 234, revenue: 46800, customers: 152 },
      { month: 'ديسمبر', bookings: 267, revenue: 53400, customers: 167 }
    ],
    serviceStats: [
      { service: 'تنظيف منزل', count: 456, revenue: 91200, avgRating: 4.9 },
      { service: 'تنظيف مكتب', count: 234, revenue: 70200, avgRating: 4.7 },
      { service: 'تنظيف سجاد', count: 189, revenue: 37800, avgRating: 4.8 },
      { service: 'تنظيف واجهات', count: 123, revenue: 36900, avgRating: 4.6 },
      { service: 'تنظيف خزانات', count: 87, revenue: 26100, avgRating: 4.9 },
      { service: 'تنظيف عميق', count: 65, revenue: 19500, avgRating: 5.0 }
    ],
    customerStats: {
      new: 234,
      returning: 543,
      vip: 115
    },
    recentActivity: [
      {
        id: '1',
        type: 'booking',
        message: 'حجز جديد من أحمد محمد لخدمة تنظيف المنزل',
        time: '2024-01-15 10:30',
        amount: 500
      },
      {
        id: '2',
        type: 'payment',
        message: 'تم استلام دفعة من فاطمة أحمد',
        time: '2024-01-15 09:45',
        amount: 800
      },
      {
        id: '3',
        type: 'review',
        message: 'مراجعة جديدة 5 نجوم من محمد علي',
        time: '2024-01-15 08:20'
      },
      {
        id: '4',
        type: 'customer',
        message: 'عميل جديد: سارة خالد',
        time: '2024-01-14 16:15'
      },
      {
        id: '5',
        type: 'booking',
        message: 'تم إكمال خدمة تنظيف المكتب لشركة النصر',
        time: '2024-01-14 14:30',
        amount: 1200
      }
    ],
    topServices: [
      { name: 'تنظيف منزل', bookings: 456, revenue: 91200, trend: 'up' },
      { name: 'تنظيف مكتب', bookings: 234, revenue: 70200, trend: 'up' },
      { name: 'تنظيف سجاد', bookings: 189, revenue: 37800, trend: 'stable' },
      { name: 'تنظيف واجهات', bookings: 123, revenue: 36900, trend: 'down' },
      { name: 'تنظيف خزانات', bookings: 87, revenue: 26100, trend: 'up' }
    ],
    lastUpdated: new Date().toISOString()
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';
    const metric = searchParams.get('metric') || 'overview';
    
    const data = getAnalyticsData();
    
    // Filter data based on requested metric
    switch (metric) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: data.overview,
          lastUpdated: data.lastUpdated
        });
      
      case 'monthly':
        return NextResponse.json({
          success: true,
          data: data.monthlyData,
          lastUpdated: data.lastUpdated
        });
      
      case 'services':
        return NextResponse.json({
          success: true,
          data: data.serviceStats,
          lastUpdated: data.lastUpdated
        });
      
      case 'customers':
        return NextResponse.json({
          success: true,
          data: data.customerStats,
          lastUpdated: data.lastUpdated
        });
      
      case 'activity':
        return NextResponse.json({
          success: true,
          data: data.recentActivity,
          lastUpdated: data.lastUpdated
        });
      
      case 'top_services':
        return NextResponse.json({
          success: true,
          data: data.topServices,
          lastUpdated: data.lastUpdated
        });
      
      default:
        return NextResponse.json({
          success: true,
          data,
          lastUpdated: data.lastUpdated
        });
    }
  } catch (error) {
    console.error('Error generating analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json();
    
    // This would typically update analytics data based on new events
    // For now, we'll just acknowledge the event
    
    console.log('Analytics event received:', event, data);
    
    return NextResponse.json({
      success: true,
      message: 'Analytics event recorded',
      event,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error recording analytics event:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics event' },
      { status: 500 }
    );
  }
}
