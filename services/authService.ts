export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'operator';
  permissions: Array<{
    module: string;
    actions: string[];
  }>;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private baseUrl: string;
  private currentUser: User | null = null;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Set token in localStorage
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  // Remove token from localStorage
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Login user
  async login(credentials: { username: string; password: string }): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      this.setToken(data.token);
      this.currentUser = data.user;
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  logout(): void {
    this.removeToken();
    this.currentUser = null;
  }

  // Verify token
  async verifyToken(): Promise<User | null> {
    const token = this.getToken();
    if (!token) {
      return null;
    }

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

      const user = await response.json();
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error('Token verification error:', error);
      this.removeToken();
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }
    return await this.verifyToken();
  }

  // Check if user has specific role
  hasRole(role: 'admin' | 'manager' | 'operator'): boolean {
    if (!this.currentUser) {
      return false;
    }
    return this.currentUser.role === role;
  }

  // Check if user has specific permission
  hasPermission(module: string, action: 'create' | 'read' | 'update' | 'delete'): boolean {
    if (!this.currentUser) {
      return false;
    }

    if (this.currentUser.role === 'admin') {
      return true;
    }

    const permission = this.currentUser.permissions.find(p => p.module === module);
    return permission?.actions.includes(action) || false;
  }
}

export const authService = new AuthService();
export default authService;
