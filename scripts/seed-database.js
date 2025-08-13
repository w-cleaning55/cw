#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Check if data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  log('✅ Created data directory', 'green');
}

// Default data files to create
const defaultDataFiles = [
  'services.json',
  'customers.json', 
  'bookings.json',
  'users.json',
  'messages.json',
  'notifications.json',
  'dashboard.json',
  'company-settings.json',
  'system-settings.json',
  'ai-knowledge-base.json',
  'color-palettes.json',
  'analytics.json'
];

const seedDatabase = async () => {
  log('🚀 Starting database seeding process...', 'cyan');
  log('', 'reset');

  let filesProcessed = 0;
  let filesCreated = 0;
  let filesSkipped = 0;

  for (const fileName of defaultDataFiles) {
    const filePath = path.join(dataDir, fileName);
    filesProcessed++;

    try {
      if (fs.existsSync(filePath)) {
        // Check if file is empty or has minimal content
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jsonContent = JSON.parse(fileContent || '{}');
        
        // Determine if file needs seeding based on content
        const needsSeeding = 
          Object.keys(jsonContent).length === 0 ||
          (jsonContent.services && jsonContent.services.length === 0) ||
          (jsonContent.customers && jsonContent.customers.length === 0) ||
          (jsonContent.bookings && jsonContent.bookings.length === 0);

        if (!needsSeeding) {
          log(`⏭️  Skipping ${fileName} (already contains data)`, 'yellow');
          filesSkipped++;
          continue;
        }
      }

      // Generate default content based on file type
      let defaultContent = {};

      switch (fileName) {
        case 'services.json':
          defaultContent = await generateDefaultServices();
          break;
        case 'customers.json':
          defaultContent = await generateDefaultCustomers();
          break;
        case 'bookings.json':
          defaultContent = await generateDefaultBookings();
          break;
        case 'users.json':
          defaultContent = await generateDefaultUsers();
          break;
        case 'messages.json':
          defaultContent = await generateDefaultMessages();
          break;
        case 'notifications.json':
          defaultContent = await generateDefaultNotifications();
          break;
        case 'dashboard.json':
          defaultContent = await generateDefaultDashboard();
          break;
        case 'company-settings.json':
          defaultContent = await generateDefaultCompanySettings();
          break;
        case 'system-settings.json':
          defaultContent = await generateDefaultSystemSettings();
          break;
        case 'ai-knowledge-base.json':
          defaultContent = await generateDefaultAIKnowledge();
          break;
        case 'color-palettes.json':
          defaultContent = await generateDefaultColorPalettes();
          break;
        case 'analytics.json':
          defaultContent = await generateDefaultAnalytics();
          break;
        default:
          defaultContent = { created: new Date().toISOString() };
      }

      // Write the file
      fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2));
      log(`✅ Created ${fileName}`, 'green');
      filesCreated++;

    } catch (error) {
      log(`❌ Error processing ${fileName}: ${error.message}`, 'red');
    }
  }

  log('', 'reset');
  log('📊 Seeding Summary:', 'bright');
  log(`   Files processed: ${filesProcessed}`, 'blue');
  log(`   Files created: ${filesCreated}`, 'green');
  log(`   Files skipped: ${filesSkipped}`, 'yellow');
  log('', 'reset');

  if (filesCreated > 0) {
    log('🎉 Database seeding completed successfully!', 'green');
    log('💡 Your system is now ready with default data.', 'cyan');
  } else {
    log('ℹ️  No new files were created. Database already contains data.', 'yellow');
  }
};

// Generator functions for default data
async function generateDefaultServices() {
  return {
    services: [
      {
        id: "service_1",
        title: "Carpet & Curtain Cleaning",
        titleAr: "تنظيف وتعقيم السجاد والستائر",
        description: "Professional deep cleaning and sterilization services for carpets and curtains using advanced equipment.",
        descriptionAr: "خدمات التنظيف العميق والتعقيم المتخصصة للسجاد والستائر باستخدام أحدث المعدات.",
        icon: "Sparkles",
        category: "Home Cleaning",
        categoryAr: "تنظيف المنازل",
        price: "Starting at 150 SAR",
        priceAr: "يبدأ من 150 ريال",
        duration: "2-4 hours",
        durationAr: "2-4 ساعات",
        featured: true,
        active: true,
        features: ["Deep steam cleaning", "Stain removal", "Fabric protection"],
        featuresAr: ["التنظيف العميق بالبخار", "إزالة البقع", "حماية الأقمشة"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    metadata: {
      total: 1,
      active: 1,
      featured: 1,
      lastUpdated: new Date().toISOString()
    }
  };
}

async function generateDefaultCustomers() {
  return {
    customers: [
      {
        id: "customer_1",
        firstName: "عبدالرحمن",
        lastName: "الغامدي",
        email: "customer@example.com",
        phone: "+966556789012",
        address: {
          street: "شارع الأمير سلطان، حي الزهراء",
          city: "جدة",
          district: "الزهراء",
          zipCode: "21589",
          country: "السعودية"
        },
        customerType: "residential",
        status: "active",
        preferredLanguage: "ar",
        totalBookings: 5,
        totalSpent: 1250.00,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    summary: {
      total: 1,
      active: 1,
      inactive: 0,
      residential: 1,
      commercial: 0,
      totalRevenue: 1250.00,
      lastUpdated: new Date().toISOString()
    }
  };
}

async function generateDefaultBookings() {
  return {
    bookings: [
      {
        id: "booking_1",
        customerId: "customer_1",
        customerName: "عبدالرحمن الغامدي",
        serviceId: "service_1",
        serviceName: "تنظيف وتعقيم السجاد والستائر",
        bookingDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: "confirmed",
        totalAmount: 200.00,
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    summary: {
      total: 1,
      confirmed: 1,
      pending: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 200.00,
      lastUpdated: new Date().toISOString()
    }
  };
}

async function generateDefaultUsers() {
  return {
    users: [
      {
        id: "admin_1",
        username: "admin",
        email: "admin@cleaningworld-jeddah.com",
        firstName: "مدير",
        lastName: "النظام",
        role: "admin",
        status: "active",
        permissions: ["all"],
        preferredLanguage: "ar",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    summary: {
      total: 1,
      active: 1,
      inactive: 0,
      lastUpdated: new Date().toISOString()
    }
  };
}

async function generateDefaultMessages() {
  return {
    messages: [],
    summary: {
      total: 0,
      unread: 0,
      replied: 0,
      pending: 0,
      lastUpdated: new Date().toISOString()
    }
  };
}

async function generateDefaultNotifications() {
  return {
    notifications: [],
    summary: {
      total: 0,
      unread: 0,
      read: 0,
      lastUpdated: new Date().toISOString()
    }
  };
}

async function generateDefaultDashboard() {
  return {
    overview: {
      totalCustomers: 1,
      activeBookings: 1,
      completedBookings: 0,
      totalRevenue: 200.00,
      lastUpdated: new Date().toISOString()
    },
    recentActivity: [],
    upcomingBookings: [],
    quickStats: {
      todayBookings: 0,
      weeklyRevenue: 0,
      pendingPayments: 200.00,
      customerSatisfaction: 0
    }
  };
}

async function generateDefaultCompanySettings() {
  return {
    company: {
      name: "عالم النظافة جدة",
      nameEn: "Cleaning World Jeddah",
      description: "شركة تنظيف احترافية في جدة",
      phone: "+966126543210",
      email: "info@cleaningworld-jeddah.com",
      address: {
        street: "شارع الأمير سلطان، حي الزهراء",
        city: "جدة",
        country: "المملكة العربية السعودية"
      },
      updatedAt: new Date().toISOString()
    }
  };
}

async function generateDefaultSystemSettings() {
  return {
    systemSettings: {
      general: {
        systemName: "عالم النظافة - نظام إدارة الخدمات",
        version: "1.0.0",
        timezone: "Asia/Riyadh",
        defaultLanguage: "ar",
        currency: "SAR"
      },
      updatedAt: new Date().toISOString()
    }
  };
}

async function generateDefaultAIKnowledge() {
  return {
    knowledgeBase: {
      companyInfo: {
        name: "عالم النظافة جدة",
        location: "جدة، المملكة العربية السعودية",
        phone: "+966126543210"
      },
      services: [],
      commonQuestions: []
    },
    metadata: {
      version: "1.0.0",
      lastUpdated: new Date().toISOString()
    }
  };
}

async function generateDefaultColorPalettes() {
  return {
    palettes: [
      {
        id: "default",
        name: "الألوان الافتراضية",
        active: true,
        isDefault: true,
        colors: {
          primary: "#0ea5e9",
          secondary: "#10b981",
          background: "#ffffff",
          foreground: "#1f2937"
        },
        createdAt: new Date().toISOString()
      }
    ],
    activePalette: "default"
  };
}

async function generateDefaultAnalytics() {
  return {
    analytics: {
      overview: {
        totalRevenue: 0,
        totalBookings: 0,
        totalCustomers: 0,
        averageRating: 0,
        lastUpdated: new Date().toISOString()
      }
    }
  };
}

// Run the seeding process
if (require.main === module) {
  seedDatabase().catch(error => {
    log(`💥 Fatal error: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { seedDatabase };
