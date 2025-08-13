import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../lib/test-utils';
import userEvent from '@testing-library/user-event';
import Header from '../../components/Header';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}));

// Mock useTranslation hook
vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: () => ({
    currentLanguage: 'ar',
    switchLanguage: vi.fn(),
    t: (key: string) => key,
  }),
}));

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with correct elements', () => {
    render(<Header />);
    
    // Check if main elements are present
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('عالم التنظيف')).toBeInTheDocument();
    expect(screen.getByText('تسجيل الدخول')).toBeInTheDocument();
  });

  it('renders navigation links correctly', () => {
    render(<Header />);
    
    expect(screen.getByText('الرئيسية')).toBeInTheDocument();
    expect(screen.getByText('الخدمات')).toBeInTheDocument();
    expect(screen.getByText('من نحن')).toBeInTheDocument();
    expect(screen.getByText('اتصل بنا')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    const loginLink = screen.getByRole('link', { name: /تسجيل الدخول/i });
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  it('renders theme toggle button', () => {
    render(<Header />);
    
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeButton).toBeInTheDocument();
  });

  it('renders language dropdown', () => {
    render(<Header />);
    
    const languageButton = screen.getByRole('button', { name: /change language/i });
    expect(languageButton).toBeInTheDocument();
  });

  it('opens mobile menu when clicked', async () => {
    render(<Header />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
    
    await userEvent.click(mobileMenuButton);
    
    // Check if mobile menu items appear
    await waitFor(() => {
      expect(screen.getAllByText('الرئيسية')).toHaveLength(2); // Desktop + Mobile
    });
  });

  it('opens language dropdown when clicked', async () => {
    render(<Header />);
    
    const languageButton = screen.getByRole('button', { name: /change language/i });
    await userEvent.click(languageButton);
    
    await waitFor(() => {
      expect(screen.getByText('العربية')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });
  });

  it('has correct link attributes for SEO', () => {
    render(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /عالم التنظيف/i });
    expect(homeLink).toHaveAttribute('href', '/');
    
    const loginLink = screen.getByRole('link', { name: /تسجيل الدخول/i });
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  it('is responsive and shows/hides elements correctly', () => {
    render(<Header />);
    
    // Desktop navigation should be visible
    const desktopNav = screen.getByRole('navigation');
    expect(desktopNav).toHaveClass('hidden', 'md:flex');
    
    // Mobile menu button should be hidden on desktop
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i });
    expect(mobileMenuButton).toHaveClass('md:hidden');
  });

  it('maintains keyboard navigation', async () => {
    render(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /عالم التنظيف/i });
    homeLink.focus();
    expect(homeLink).toHaveFocus();
    
    // Tab through navigation
    await userEvent.tab();
    const servicesLink = screen.getByText('الخدمات');
    expect(servicesLink.closest('a')).toHaveFocus();
  });

  it('has proper ARIA labels and roles', () => {
    render(<Header />);
    
    const themeButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeButton).toHaveAttribute('aria-label', expect.any(String));
    
    const languageButton = screen.getByRole('button', { name: /change language/i });
    expect(languageButton).toHaveAttribute('aria-label', expect.any(String));
  });
});
