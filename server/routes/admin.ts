import { RequestHandler } from "express";
import { z } from "zod";
import { dataManager } from "../utils/dataManager";

// Schema definitions
const ServiceSchema = z.object({
  title: z.string().min(1),
  titleAr: z.string().optional(),
  description: z.string().min(1),
  descriptionAr: z.string().optional(),
  icon: z.string(),
  category: z.string(),
  categoryAr: z.string().optional(),
  price: z.string(),
  priceAr: z.string().optional(),
  duration: z.string(),
  durationAr: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  features: z.array(z.string()),
  featuresAr: z.array(z.string()).optional(),
  image: z.string().optional()
});

const UserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'editor', 'moderator', 'user']),
  status: z.enum(['active', 'inactive']).default('active'),
  avatar: z.string().optional(),
  profile: z.object({
    phone: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    preferences: z.object({
      language: z.enum(['en', 'ar']).default('en'),
      theme: z.string().default('light'),
      notifications: z.boolean().default(true)
    }).optional()
  }).optional()
});

// Dashboard endpoints
export const handleGetDashboard: RequestHandler = async (req, res) => {
  try {
    const dashboardData = await dataManager.readData('dashboard');
    if (!dashboardData) {
      return res.status(404).json({ error: 'Dashboard data not found' });
    }
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

// Services endpoints
export const handleGetServices: RequestHandler = async (req, res) => {
  try {
    const servicesData = await dataManager.readData('services');
    if (!servicesData) {
      return res.status(404).json({ error: 'Services data not found' });
    }
    res.json(servicesData);
  } catch (error) {
    console.error('Services error:', error);
    res.status(500).json({ error: 'Failed to load services data' });
  }
};

export const handleGetService: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await dataManager.findArrayItem('services', 'services', id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Service error:', error);
    res.status(500).json({ error: 'Failed to load service' });
  }
};

export const handleCreateService: RequestHandler = async (req, res) => {
  try {
    const serviceData = ServiceSchema.parse(req.body);
    
    const newService = {
      id: dataManager.generateId(),
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = await dataManager.appendToArray('services', 'services', newService);
    
    if (success) {
      res.status(201).json(newService);
    } else {
      res.status(500).json({ error: 'Failed to create service' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const handleUpdateService: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = ServiceSchema.partial().parse(req.body);
    
    const updatedService = await dataManager.updateArrayItem<any>('services', 'services', id, updates as any);
    
    if (updatedService) {
      res.json(updatedService);
    } else {
      res.status(404).json({ error: 'Service not found or update failed' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const handleDeleteService: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dataManager.deleteArrayItem('services', 'services', id);
    
    if (success) {
      res.json({ success: true, message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ error: 'Service not found or delete failed' });
    }
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

// Users endpoints
export const handleGetUsers: RequestHandler = async (req, res) => {
  try {
    const usersData = await dataManager.readData('users');
    if (!usersData) {
      return res.status(404).json({ error: 'Users data not found' });
    }
    res.json(usersData);
  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ error: 'Failed to load users data' });
  }
};

export const handleGetUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await dataManager.findArrayItem('users', 'users', id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('User error:', error);
    res.status(500).json({ error: 'Failed to load user' });
  }
};

export const handleCreateUser: RequestHandler = async (req, res) => {
  try {
    const userData = UserSchema.parse(req.body);
    
    const newUser = {
      id: dataManager.generateId(),
      ...userData,
      joinedAt: new Date().toISOString(),
      lastLogin: null,
      permissions: getUserPermissions(userData.role),
      profile: {
        ...userData.profile,
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: true,
          ...userData.profile?.preferences
        }
      }
    };

    const success = await dataManager.appendToArray('users', 'users', newUser);
    
    if (success) {
      res.status(201).json(newUser);
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const handleUpdateUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = UserSchema.partial().parse(req.body);
    
    // Update permissions if role changed
    if (updates.role) {
      (updates as any).permissions = getUserPermissions(updates.role);
    }
    
    const updatedUser = await dataManager.updateArrayItem<any>('users', 'users', id, updates as any);
    
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found or update failed' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const handleDeleteUser: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dataManager.deleteArrayItem('users', 'users', id);
    
    if (success) {
      res.json({ success: true, message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found or delete failed' });
    }
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Analytics endpoints
export const handleGetAnalytics: RequestHandler = async (req, res) => {
  try {
    const dashboardData = await dataManager.readData('dashboard');
    if (!dashboardData) {
      return res.status(404).json({ error: 'Analytics data not found' });
    }
    
    res.json({
      analytics: (dashboardData as any).analytics,
      systemStatus: (dashboardData as any).systemStatus,
      recentActivity: (dashboardData as any).recentActivity
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to load analytics data' });
  }
};

// Utility function to get permissions based on role
function getUserPermissions(role: string): string[] {
  const permissions: Record<string, string[]> = {
    admin: ['read', 'write', 'delete', 'admin'],
    editor: ['read', 'write'],
    moderator: ['read', 'write', 'moderate'],
    user: ['read']
  };
  
  return permissions[role] || ['read'];
}

// Search endpoints
export const handleSearchServices: RequestHandler = async (req, res) => {
  try {
    const { q, category, featured, active } = req.query;
    const servicesData = await dataManager.readData<any>('services');
    
    if (!servicesData) {
      return res.status(404).json({ error: 'Services data not found' });
    }
    
    let filteredServices = servicesData.services;
    
    // Text search
    if (q) {
      const query = (q as string).toLowerCase();
      filteredServices = filteredServices.filter((service: any) =>
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (category) {
      filteredServices = filteredServices.filter((service: any) =>
        service.category === category
      );
    }
    
    // Featured filter
    if (featured !== undefined) {
      filteredServices = filteredServices.filter((service: any) =>
        service.featured === (featured === 'true')
      );
    }
    
    // Active filter
    if (active !== undefined) {
      filteredServices = filteredServices.filter((service: any) =>
        service.active === (active === 'true')
      );
    }
    
    res.json({
      services: filteredServices,
      total: filteredServices.length,
      filters: { q, category, featured, active }
    });
  } catch (error) {
    console.error('Search services error:', error);
    res.status(500).json({ error: 'Failed to search services' });
  }
};

export const handleSearchUsers: RequestHandler = async (req, res) => {
  try {
    const { q, role, status } = req.query;
    const usersData = await dataManager.readData<any>('users');
    
    if (!usersData) {
      return res.status(404).json({ error: 'Users data not found' });
    }
    
    let filteredUsers = usersData.users;
    
    // Text search
    if (q) {
      const query = (q as string).toLowerCase();
      filteredUsers = filteredUsers.filter((user: any) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
    
    // Role filter
    if (role) {
      filteredUsers = filteredUsers.filter((user: any) => user.role === role);
    }
    
    // Status filter
    if (status) {
      filteredUsers = filteredUsers.filter((user: any) => user.status === status);
    }
    
    res.json({
      users: filteredUsers,
      total: filteredUsers.length,
      filters: { q, role, status }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};
