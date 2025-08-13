import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  serviceType: string;
  date: string;
  time: string;
  address: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  paymentStatus: 'pending' | 'partial' | 'paid' | 'refunded';
  assignedTeam?: string;
  createdAt: string;
  updatedAt: string;
}

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getDefaultBookings(): Booking[] {
  return [
    {
      id: 'BK001',
      customerName: 'أحمد محمد',
      customerEmail: 'ahmed@example.com',
      customerPhone: '+966501234567',
      service: 'تنظيف منزل',
      serviceType: 'residential',
      date: '2024-01-20',
      time: '10:00',
      address: 'الرياض، حي الملز، شارع الأمير محمد بن عبدالعزيز',
      notes: 'يرجى التركيز على المطبخ والحمامات',
      status: 'confirmed',
      price: 500,
      paymentStatus: 'paid',
      assignedTeam: 'فريق أ',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'BK002',
      customerName: 'فاطمة أحمد',
      customerEmail: 'fatima@example.com',
      customerPhone: '+966509876543',
      service: 'تنظيف مكتب',
      serviceType: 'commercial',
      date: '2024-01-18',
      time: '14:00',
      address: 'الرياض، حي العليا، برج الفيصلية',
      status: 'in_progress',
      price: 800,
      paymentStatus: 'partial',
      assignedTeam: 'فريق ب',
      createdAt: '2024-01-14T14:20:00Z',
      updatedAt: '2024-01-16T09:15:00Z'
    },
    {
      id: 'BK003',
      customerName: 'محمد علي',
      customerEmail: 'mohammed@example.com',
      customerPhone: '+966512345678',
      service: 'تنظيف سجاد',
      serviceType: 'specialized',
      date: '2024-01-25',
      time: '09:00',
      address: 'الرياض، حي الدرعية، فيلا رقم 123',
      notes: 'سجاد فارسي يحتاج عناية خاصة',
      status: 'pending',
      price: 300,
      paymentStatus: 'pending',
      createdAt: '2024-01-13T09:15:00Z',
      updatedAt: '2024-01-13T09:15:00Z'
    }
  ];
}

export async function GET() {
  try {
    ensureDataDirectory();
    
    let bookings: Booking[];
    
    if (fs.existsSync(BOOKINGS_FILE)) {
      const fileContent = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      bookings = JSON.parse(fileContent);
    } else {
      bookings = getDefaultBookings();
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    }
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error reading bookings:', error);
    return NextResponse.json(
      { error: 'Failed to load bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const newBooking = await request.json();
    
    let bookings: Booking[] = [];
    if (fs.existsSync(BOOKINGS_FILE)) {
      const fileContent = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
      bookings = JSON.parse(fileContent);
    }
    
    const booking: Booking = {
      id: `BK${String(bookings.length + 1).padStart(3, '0')}`,
      ...newBooking,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    ensureDataDirectory();
    
    const { id, ...updates } = await request.json();
    
    if (!fs.existsSync(BOOKINGS_FILE)) {
      return NextResponse.json(
        { error: 'Bookings file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    let bookings: Booking[] = JSON.parse(fileContent);
    
    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      booking: bookings[bookingIndex],
      message: 'Booking updated successfully' 
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
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
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    
    if (!fs.existsSync(BOOKINGS_FILE)) {
      return NextResponse.json(
        { error: 'Bookings file not found' },
        { status: 404 }
      );
    }
    
    const fileContent = fs.readFileSync(BOOKINGS_FILE, 'utf-8');
    let bookings: Booking[] = JSON.parse(fileContent);
    
    const initialLength = bookings.length;
    bookings = bookings.filter(b => b.id !== id);
    
    if (bookings.length === initialLength) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Booking deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
