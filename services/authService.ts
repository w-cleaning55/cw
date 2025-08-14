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
  private currentUser: User | null = null;

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
      this.currentUser = data.user;
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
      this.currentUser = null;
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
        this.currentUser = null;
        return null;
      }

      const user = await response.json();
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      this.removeToken();
      this.currentUser = null;
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

  // Get current user (from cache or verify token)
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }
    return await this.verifyToken();
  }

  // Check if user has specific role
  hasRole(role: 'admin' | 'manager' | 'operator'): boolean {
    if (!this.currentUser) {
      // Try to get user from token if not cached
      const token = this.getToken();
      if (!token) return false;
      
      // For now, return false if user is not cached
      // In a real implementation, you might want to verify the token here
      return false;
    }
    
    return this.currentUser.role === role;
  }

  // Check if user has specific permission
  hasPermission(module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
    if (!this.currentUser) {
      return false;
    }

    // Check if user has admin role (full permissions)
    if (this.currentUser.role === 'admin') {
      return true;
    }

    // Check specific permissions
    const permission = this.currentUser.permissions.find(p => p.module === module);
    return permission?.actions.includes(action) || false;
  }

  // Update user data
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const updatedUser = await response.json();
      
      // Update cached user if it's the current user
      if (this.currentUser && this.currentUser.id === userId) {
        this.currentUser = updatedUser;
      }

      return updatedUser;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to register user');
      }

      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
