import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

function ensureUploadDirectory() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

function isValidImageType(mimeType: string): boolean {
  return ALLOWED_TYPES.includes(mimeType);
}

function generateUniqueFilename(originalName: string): string {
  const ext = getFileExtension(originalName);
  const uuid = uuidv4();
  const timestamp = Date.now();
  return `${timestamp}_${uuid}${ext}`;
}

export async function POST(request: NextRequest) {
  try {
    ensureUploadDirectory();
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string || 'general';
    const category = formData.get('category') as string || 'uncategorized';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!isValidImageType(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed' },
        { status: 400 }
      );
    }
    
    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    
    // Create category directory if it doesn't exist
    const categoryDir = path.join(UPLOAD_DIR, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    const filePath = path.join(categoryDir, filename);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    fs.writeFileSync(filePath, buffer);
    
    // Generate public URL
    const imageUrl = `/uploads/${category}/${filename}`;
    
    // Save metadata (optional - for future features)
    const metadata = {
      id: uuidv4(),
      originalName: file.name,
      filename,
      size: file.size,
      type: file.type,
      category,
      uploadType: type,
      url: imageUrl,
      uploadedAt: new Date().toISOString()
    };
    
    // You could save this metadata to a database or JSON file for tracking
    
    return NextResponse.json({
      success: true,
      imageUrl,
      metadata,
      message: 'Image uploaded successfully'
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'uncategorized';
    
    ensureUploadDirectory();
    
    const categoryDir = path.join(UPLOAD_DIR, category);
    
    if (!fs.existsSync(categoryDir)) {
      return NextResponse.json({
        success: true,
        images: [],
        total: 0
      });
    }
    
    const files = fs.readdirSync(categoryDir);
    const images = files
      .filter(file => {
        const ext = getFileExtension(file);
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(categoryDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          url: `/uploads/${category}/${file}`,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    
    return NextResponse.json({
      success: true,
      images,
      total: images.length
    });
    
  } catch (error) {
    console.error('Error listing images:', error);
    return NextResponse.json(
      { error: 'Failed to list images' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const category = searchParams.get('category') || 'uncategorized';
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }
    
    const filePath = path.join(UPLOAD_DIR, category, filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    fs.unlinkSync(filePath);
    
    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
