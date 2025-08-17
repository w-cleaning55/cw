import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { 
  withErrorHandler, 
  createSuccessResponse, 
  parseRequestBody, 
  validateRequired,
  safeFileRead,
  safeFileWrite,
  paginateArray,
  getDefaultResponse
} from '../../../../lib/api-utils';

const SERVICES_FILE = path.join(process.cwd(), 'data', 'services.json');

export const GET = withErrorHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const category = url.searchParams.get('category');
  const featured = url.searchParams.get('featured');
  
  const servicesData = await safeFileRead(SERVICES_FILE, { services: getDefaultResponse('array') });
  let services = servicesData.services || [];
  
  // Apply filters
  if (category) {
    services = services.filter((service: any) => 
      service.category?.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (featured === 'true') {
    services = services.filter((service: any) => service.featured === true);
  }
  
  // Paginate results
  const paginatedResult = paginateArray(services, page, limit);
  
  return NextResponse.json(
    createSuccessResponse(paginatedResult.data, 'Services retrieved successfully', paginatedResult.pagination)
  );
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await parseRequestBody(request);
  
  // Validation
  validateRequired(body.title, 'title');
  validateRequired(body.titleAr, 'titleAr');
  validateRequired(body.description, 'description');
  validateRequired(body.descriptionAr, 'descriptionAr');
  validateRequired(body.category, 'category');
  validateRequired(body.price, 'price');
  
  const servicesData = await safeFileRead(SERVICES_FILE, { services: getDefaultResponse('array') });
  
  // Create new service with proper structure
  const service = {
    ...body,
    id: `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    active: body.active !== undefined ? body.active : true,
    featured: body.featured !== undefined ? body.featured : false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    views: 0,
    bookings: 0
  };
  
  servicesData.services.push(service);
  
  await safeFileWrite(SERVICES_FILE, servicesData);
  
  return NextResponse.json(
    createSuccessResponse(service, 'Service created successfully'),
    { status: 201 }
  );
});

export const PUT = withErrorHandler(async (request: NextRequest) => {
  const body = await parseRequestBody(request);
  
  validateRequired(body.id, 'id');
  
  const servicesData = await safeFileRead(SERVICES_FILE, { services: getDefaultResponse('array') });
  const serviceIndex = servicesData.services.findIndex((s: any) => s.id === body.id);
  
  if (serviceIndex === -1) {
    return NextResponse.json(
      createSuccessResponse(null, 'Service not found'),
      { status: 404 }
    );
  }
  
  // Update service
  servicesData.services[serviceIndex] = {
    ...servicesData.services[serviceIndex],
    ...body,
    updatedAt: new Date().toISOString()
  };
  
  await safeFileWrite(SERVICES_FILE, servicesData);
  
  return NextResponse.json(
    createSuccessResponse(servicesData.services[serviceIndex], 'Service updated successfully')
  );
});

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  validateRequired(id, 'id');
  
  const servicesData = await safeFileRead(SERVICES_FILE, { services: getDefaultResponse('array') });
  const originalLength = servicesData.services.length;
  
  servicesData.services = servicesData.services.filter((s: any) => s.id !== id);
  
  if (servicesData.services.length === originalLength) {
    return NextResponse.json(
      createSuccessResponse(null, 'Service not found'),
      { status: 404 }
    );
  }
  
  await safeFileWrite(SERVICES_FILE, servicesData);
  
  return NextResponse.json(
    createSuccessResponse(null, 'Service deleted successfully')
  );
});
