import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  customerType: 'individual' | 'business';
  registrationDate: string;
  lastServiceDate?: string;
  totalBookings: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'vip';
  notes?: string;
  preferences?: {
    preferredTime?: string;
    specialRequests?: string[];
    communicationMethod?: 'phone' | 'email' | 'whatsapp';
  };
  createdAt: string;
  updatedAt: string;
}

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultCustomers(): Customer[] {
  return [
    {
      id: 'CUST001',
      name: 'أحمد محمد السعد',
      email: 'ahmed.saad@example.com',
      phone: '+966501234567',
      address: 'حي الملز، شارع الأمير محمد بن عبدالعزيز، الرياض',
      city: 'الرياض',
      customerType: 'individual',
      registrationDate: '2023-06-15',
      lastServiceDate: '2024-01-15',
      totalBookings: 12,
      totalSpent: 3600,
      status: 'vip',
      notes: 'عميل مميز، يفضل ال��دمة في الصباح الباكر',
      preferences: {
        preferredTime: 'morning',
        specialRequests: ['استخدام منتجات صديقة للبيئة', 'تجنب الروائح القوية'],
        communicationMethod: 'whatsapp'
      },
      createdAt: '2023-06-15T09:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'CUST002',
      name: 'فاطمة أحمد النصر',
      email: 'fatima.nasr@example.com',
      phone: '+966509876543',
      address: 'حي العليا، برج الفيصلية، الرياض',
      city: 'الرياض',
      customerType: 'business',
      registrationDate: '2023-09-20',
      lastServiceDate: '2024-01-16',
      totalBookings: 8,
      totalSpent: 6400,
      status: 'active',
      notes: 'شركة محاماة، تحتاج خدمة أسبوعية',
      preferences: {
        preferredTime: 'afternoon',
        specialRequests: ['تنظيف أجهزة الكمبيوتر', 'تعقيم دوري'],
        communicationMethod: 'email'
      },
      createdAt: '2023-09-20T14:20:00Z',
      updatedAt: '2024-01-16T09:15:00Z'
    },
    {
      id: 'CUST003',
      name: 'محمد علي الراشد',
      email: 'mohammed.rashid@example.com',
      phone: '+966512345678',
      address: 'حي الدرعية، فيلا رقم 123، الرياض',
      city: 'الرياض',
      customerType: 'individual',
      registrationDate: '2024-01-10',
      totalBookings: 1,
      totalSpent: 300,
      status: 'active',
      notes: 'عميل جديد، لديه حساسية من بعض المنتجات',
      preferences: {
        preferredTime: 'morning',
        specialRequests: ['منتجات مضادة للحساسية'],
        communicationMethod: 'phone'
      },
      createdAt: '2024-01-10T11:30:00Z',
      updatedAt: '2024-01-13T09:15:00Z'
    },
    {
      id: 'CUST004',
      name: 'سارة خالد المطيري',
      email: 'sara.mutairi@example.com',
      phone: '+966505555555',
      address: 'حي النرجس، شارع التحلية، الرياض',
      city: 'الرياض',
      customerType: 'individual',
      registrationDate: '2023-03-12',
      lastServiceDate: '2023-12-20',
      totalBookings: 25,
      totalSpent: 8750,
      status: 'vip',
      notes: 'عميلة دائمة منذ أكثر من عام، خدمة شهرية منتظمة',
      preferences: {
        preferredTime: 'morning',
        specialRequests: ['تنظيف عميق للمطبخ', 'عناية خاصة بالنباتات'],
        communicationMethod: 'whatsapp'
      },
      createdAt: '2023-03-12T08:45:00Z',
      updatedAt: '2023-12-20T14:30:00Z'
    }
  ];
}

export async function GET() {
  try {
    ensureDataDirectory();
    
    let customers: Customer[];
    
    if (fs.existsSync(CUSTOMERS_FILE)) {
      const fileContent = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
      customers = JSON.parse(fileContent);
    } else {
      customers = getDefaultCustomers();
      fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    }
    
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error reading customers:', error);
    return NextResponse.json(
      { error: 'Failed to load customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const newCustomer = await request.json();
    
    let customers: Customer[] = [];
    if (fs.existsSync(CUSTOMERS_FILE)) {
      const fileContent = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
      customers = JSON.parse(fileContent);
    }
    
    const customer: Customer = {
      id: `CUST${String(customers.length + 1).padStart(3, '0')}`,
      ...newCustomer,
      totalBookings: 0,
      totalSpent: 0,
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    customers.push(customer);
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      customer,
      message: 'Customer created successfully' 
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { id, ...updates } = await request.json();
    
    if (!fs.existsSync(CUSTOMERS_FILE)) {
      return NextResponse.json(
        { error: 'Customers file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    let customers: Customer[] = JSON.parse(fileContent);
    
    const customerIndex = customers.findIndex(c => c.id === id);
    if (customerIndex === -1) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    customers[customerIndex] = {
      ...customers[customerIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      customer: customers[customerIndex],
      message: 'Customer updated successfully' 
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }
    
    if (!fs.existsSync(CUSTOMERS_FILE)) {
      return NextResponse.json(
        { error: 'Customers file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    let customers: Customer[] = JSON.parse(fileContent);
    
    const initialLength = customers.length;
    customers = customers.filter(c => c.id !== id);
    
    if (customers.length === initialLength) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }
    
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(customers, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Customer deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
