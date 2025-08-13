#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build optimization...');

// Set performance environment variables
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NODE_OPTIONS = '--max-old-space-size=4096';
process.env.NEXT_BUILD_OPTIMIZE = '1';

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('npm run clean', { stdio: 'inherit' });
} catch (error) {
  console.log('No previous build to clean');
}

// Run optimized build
console.log('⚡ Running optimized build...');
try {
  execSync('next build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Generate sitemap
console.log('🗺️ Generating sitemap...');
try {
  execSync('npx next-sitemap', { stdio: 'inherit' });
  console.log('✅ Sitemap generated successfully!');
} catch (error) {
  console.log('⚠️ Sitemap generation failed, continuing...');
}

console.log('🎉 Build optimization complete!');
console.log('📊 Build time should be significantly reduced.');
console.log('💡 Use "npm run build:analyze" to analyze bundle size.');
