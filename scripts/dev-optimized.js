#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting optimized development server...');

// Set development environment variables for faster builds
process.env.NODE_ENV = 'development';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';

// Clean development cache if it exists
const devCachePath = path.join(process.cwd(), '.next');
if (fs.existsSync(devCachePath)) {
  console.log('🧹 Cleaning development cache...');
  try {
    fs.rmSync(devCachePath, { recursive: true, force: true });
    console.log('✅ Development cache cleaned');
  } catch (error) {
    console.log('⚠️ Could not clean cache, continuing...');
  }
}

// Start optimized development server
console.log('⚡ Starting Next.js development server with optimizations...');

const devProcess = spawn('next', ['dev'], {
  stdio: 'inherit',
  env: { ...process.env },
  shell: true
});

// Handle process events
devProcess.on('error', (error) => {
  console.error('❌ Failed to start development server:', error.message);
  process.exit(1);
});

devProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Development server exited with code ${code}`);
    process.exit(code);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development server...');
  devProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development server...');
  devProcess.kill('SIGTERM');
  process.exit(0);
});
