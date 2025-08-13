import { NextRequest, NextResponse } from 'next/server';
import { 
  withErrorHandler, 
  createSuccessResponse, 
  parseRequestBody, 
  validateRequired
} from '../../../../lib/api-utils';

export const POST = withErrorHandler(async (request: NextRequest) => {
  return NextResponse.json(
    createSuccessResponse(null, 'AI chat system not available. Please configure AI settings first.'),
    { status: 503 }
  );
});

export const GET = withErrorHandler(async (request: NextRequest) => {
  return NextResponse.json(
    createSuccessResponse(
      {
        activeSessions: 0,
        sessionsByContext: {},
        commonIntents: {},
        averageResponseTime: 0,
        customerSatisfaction: 0
      }, 
      'AI chat system not available'
    )
  );
});
