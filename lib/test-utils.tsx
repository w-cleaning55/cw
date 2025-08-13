import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextRouter } from 'next/router';
import { vi } from 'vitest';

// Mock Next.js router
export const mockRouter: Partial<NextRouter> = {
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  push: vi.fn(() => Promise.resolve(true)),
  replace: vi.fn(() => Promise.resolve(true)),
  reload: vi.fn(),
  prefetch: vi.fn(() => Promise.resolve()),
  back: vi.fn(),
  beforePopState: vi.fn(),
  isFallback: false,
  isLocaleDomain: true,
  isReady: true,
  isPreview: false,
};

// Mock providers for testing
const TestProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  );
};

// Custom render function
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const user = userEvent.setup();
  
  return {
    user,
    ...render(ui, { wrapper: TestProviders, ...options }),
  };
};

// Mock API responses
export const mockApiResponses = {
  services: {
    success: true,
    data: [
      {
        id: '1',
        title: 'Test Service',
        titleAr: 'خدمة اختبار',
        description: 'Test description',
        descriptionAr: 'وصف اختبار',
        price: '100 SAR',
        category: 'Home Cleaning',
        featured: true,
        active: true
      }
    ],
    message: 'Services retrieved successfully'
  },
  bookings: {
    success: true,
    data: [
      {
        id: '1',
        customerName: 'Test Customer',
        customerPhone: '+966501234567',
        customerEmail: 'test@example.com',
        service: 'Test Service',
        amount: 100,
        status: 'pending',
        scheduledDate: '2024-01-01',
        scheduledTime: '10:00 AM',
        location: 'Test Location',
        address: 'Test Address'
      }
    ],
    message: 'Bookings retrieved successfully'
  },
  customers: {
    success: true,
    data: [
      {
        id: '1',
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+966501234567',
        status: 'active',
        totalBookings: 5,
        totalSpent: 500
      }
    ],
    message: 'Customers retrieved successfully'
  }
};

// API mocking utilities
export const mockFetch = (response: any, status = 200) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  ) as any;
};

// Test data generators
export const generateTestService = (overrides = {}) => ({
  id: `test-service-${Date.now()}`,
  title: 'Test Service',
  titleAr: 'خدمة اختبار',
  description: 'Test service description',
  descriptionAr: 'وصف خدمة اختبار',
  category: 'Home Cleaning',
  categoryAr: 'تنظيف المنازل',
  price: '100 SAR',
  priceAr: '100 ريال',
  duration: '2 hours',
  durationAr: 'ساعتان',
  featured: false,
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const generateTestBooking = (overrides = {}) => ({
  id: `test-booking-${Date.now()}`,
  customerName: 'Test Customer',
  customerPhone: '+966501234567',
  customerEmail: 'test@example.com',
  service: 'Test Service',
  serviceId: 'test-service-1',
  amount: 100,
  status: 'pending' as const,
  scheduledDate: '2024-01-01',
  scheduledTime: '10:00 AM',
  location: 'Test Location',
  address: 'Test Address, Test City',
  notes: 'Test notes',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const generateTestCustomer = (overrides = {}) => ({
  id: `test-customer-${Date.now()}`,
  name: 'Test Customer',
  email: 'test@example.com',
  phone: '+966501234567',
  status: 'active' as const,
  address: 'Test Address',
  city: 'Test City',
  preferences: {
    language: 'ar',
    notifications: true,
    newsletter: false
  },
  totalBookings: 0,
  totalSpent: 0,
  lastBooking: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

// Assertion helpers
export const expectElementToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectElementToHaveText = (element: HTMLElement, text: string) => {
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent(text);
};

export const expectApiCallToHaveBeenMade = (url: string, method = 'GET') => {
  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining(url),
    expect.objectContaining({ method: method.toUpperCase() })
  );
};

// Wait utilities
export const waitForApiCall = () => new Promise(resolve => setTimeout(resolve, 100));

export const waitForElement = async (getByTestId: any, testId: string, timeout = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const element = getByTestId(testId);
      if (element) return element;
    } catch (e) {
      // Element not found yet
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Element with testId "${testId}" not found within ${timeout}ms`);
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { userEvent };
export { customRender as render };
