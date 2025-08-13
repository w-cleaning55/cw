// Shared embedded data for Vercel serverless functions
export const embeddedUsers = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@cleaningworld.sa',
    // password: admin123
    password: '$2b$10$cnmRVkKL012/IbI2.1SbGe5gVhcjfge9/wdE3zJlwb3pazO3wC7hK',
    role: 'admin',
    permissions: [
      { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'services', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'bookings', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'customers', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'admin-test-1',
    username: 'testadmin',
    email: 'testadmin@cleaningworld.sa',
    // password: test123
    password: '$2b$10$lCvruuPWcjumULGIlaeiiOtfBU2xFJIwuxhNTRH9/oV62lIe.hRQW',
    role: 'admin',
    permissions: [
      { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'services', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'bookings', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'customers', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'settings', actions: ['create', 'read', 'update', 'delete'] },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getDefaultPalettes() {
  return [
    {
      id: 'clean-light',
      name: 'Clean Light',
      nameAr: 'نظيف فاتح',
      description: 'Clean and professional light theme for cleaning services',
      descriptionAr: 'ثيم فاتح نظيف ومهني لخدمات التنظيف',
      category: 'business',
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#0ea5e9',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#0f172a',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        success: '#16a34a',
        warning: '#ea580c',
        error: '#dc2626',
        info: '#0ea5e9',
      },
      cssVariables: {
        '--radius': '0.5rem',
        '--brand-50': '240 100% 98%',
        '--brand-500': '217 91% 60%',
        '--brand-600': '217 91% 52%',
      },
      isActive: true,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'clean-dark',
      name: 'Clean Dark',
      nameAr: 'نظيف داكن',
      description: 'Modern dark theme with professional cleaning aesthetics',
      descriptionAr: 'ثيم داكن عصري بجماليات تنظيف مهنية',
      category: 'business',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#06b6d4',
        background: '#0f172a',
        surface: '#1e293b',
        text: '#f1f5f9',
        textSecondary: '#94a3b8',
        border: '#334155',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#06b6d4',
      },
      cssVariables: {
        '--radius': '0.5rem',
        '--brand-50': '220 14% 10%',
        '--brand-500': '217 91% 60%',
        '--brand-600': '217 91% 52%',
      },
      isActive: false,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function sanitizeUser(user: any) {
  const { password, ...rest } = user;
  return rest;
}


