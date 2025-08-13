import fs from 'fs';
import path from 'path';

console.log('🔨 Preparing files for Vercel deployment...');

// Create api directory if it doesn't exist
const apiDir = './api';
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// We don't need to copy files since Vercel will handle the serverless function
// The api/index.js already exists and will import from the server directory

console.log('✅ Vercel build preparation completed');
