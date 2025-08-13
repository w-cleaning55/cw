import { NextResponse } from 'next/server';
import { DEFAULT_RESPONSES, VALIDATION_RULES } from './constants';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Classes
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

// API Response Helpers
export function createSuccessResponse<T>(
  data: T, 
  message?: string,
  pagination?: PaginatedResponse<T>['pagination']
): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
    ...(pagination && { pagination }),
    timestamp: new Date().toISOString()
  };
}

export function createErrorResponse(
  error: string, 
  statusCode: number = 500
): ApiResponse {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString()
  };
}

// Error Handler Wrapper
export function withErrorHandler(handler: Function) {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ApiError) {
        return NextResponse.json(
          createErrorResponse(error.message, error.statusCode),
          { status: error.statusCode }
        );
      }
      
      if (error instanceof ValidationError) {
        return NextResponse.json(
          createErrorResponse(`Validation error: ${error.message}`, 400),
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        createErrorResponse('Internal server error', 500),
        { status: 500 }
      );
    }
  };
}

// Data Validation
export function validateRequired(value: any, fieldName: string): void {
  if (!VALIDATION_RULES.required(value)) {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
}

export function validateEmail(email: string): void {
  if (!VALIDATION_RULES.email.test(email)) {
    throw new ValidationError('Invalid email format', 'email');
  }
}

export function validatePhone(phone: string): void {
  if (!VALIDATION_RULES.phone.test(phone)) {
    throw new ValidationError('Invalid phone number format', 'phone');
  }
}

// Data Sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

// File Operations
export async function safeFileRead(filePath: string, fallback: any = null): Promise<any> {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Failed to read file ${filePath}, using fallback:`, error);
    return fallback;
  }
}

export async function safeFileWrite(filePath: string, data: any): Promise<void> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    
    // Write file with backup
    const backupPath = `${filePath}.backup`;
    try {
      await fs.copyFile(filePath, backupPath);
    } catch (e) {
      // File doesn't exist yet, that's ok
    }
    
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Failed to write file ${filePath}:`, error);
    throw new ApiError(`Failed to save data: ${error}`);
  }
}

// Request Parsing
export async function parseRequestBody(request: Request): Promise<any> {
  try {
    const body = await request.json();
    return sanitizeInput(body);
  } catch (error) {
    throw new ValidationError('Invalid JSON in request body');
  }
}

// Pagination
export function paginateArray<T>(
  array: T[], 
  page: number = 1, 
  limit: number = 10
): { data: T[]; pagination: PaginatedResponse<T>['pagination'] } {
  const offset = (page - 1) * limit;
  const paginatedData = array.slice(offset, offset + limit);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit)
    }
  };
}

// Default Fallbacks
export function getDefaultResponse(type: keyof typeof DEFAULT_RESPONSES): any {
  return DEFAULT_RESPONSES[type];
}
