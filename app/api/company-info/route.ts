import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const companyPath = join(process.cwd(), 'data', 'company-settings.json');
    const companyData = JSON.parse(readFileSync(companyPath, 'utf8'));

    return NextResponse.json(companyData);
  } catch (error) {
    console.error('Error reading company data:', error);
    return NextResponse.json(
      { error: 'Failed to load company information' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Implement company info update logic
    return NextResponse.json(
      { message: 'Company info update not implemented yet' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error updating company info:', error);
    return NextResponse.json(
      { error: 'Failed to update company information' },
      { status: 500 }
    );
  }
}
