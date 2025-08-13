export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  permissions: Array<{
    module: string;
    actions: Array<'create' | 'read' | 'update' | 'delete'>;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private baseUrl: string;
  private tokenKey = 'auth_token';

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? '/api' : 'http://localhost:3000/api';
  }

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string; debug?: any }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login?debug=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let message = 'بيانات تسجيل الدخول غير صحيحة';
        try {
          const data = await response.json();
          if (data?.error) message = data.error;
          if (data?.debug) {
            // Pass through debug details to caller via thrown error
            const err: any = new Error(message);
            err.debug = data.debug;
            throw err;
          }
        } catch (_) {
          // ignore parse errors
        }
        throw new Error(message);
      }

      const data = await response.json();
      this.setToken(data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.removeToken();
    }
  }

  async verifyToken(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${this.baseUrl}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        this.removeToken();
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      this.removeToken();
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
