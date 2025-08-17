import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveDataToFile } from '@/lib/staticData';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json({ error: 'Page parameter is required' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'data', 'pages', `${page}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading page content:', error);
    return NextResponse.json({ error: 'Failed to read page content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageName, content } = body;

    if (!pageName || !content) {
      return NextResponse.json({ error: 'Page name and content are required' }, { status: 400 });
    }

    // Validate JSON structure
    if (!content.title || !content.sections || !Array.isArray(content.sections)) {
      return NextResponse.json({ error: 'Invalid content structure' }, { status: 400 });
    }

    // Save to file
    const success = await saveDataToFile(`pages/${pageName}.json`, content);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Content saved successfully',
      pageName 
    });
  } catch (error) {
    console.error('Error saving page content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
