#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 Performance Check Starting...');

const startTime = Date.now();

// Check current build size
console.log('📦 Checking current build size...');
try {
  if (fs.existsSync('.next')) {
    const stats = fs.statSync('.next');
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`Current build size: ${sizeInMB} MB`);
  }
} catch (error) {
  console.log('No existing build found');
}

// Check dependencies
console.log('🔍 Analyzing dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const totalDeps = Object.keys(packageJson.dependencies || {}).length;
  const totalDevDeps = Object.keys(packageJson.devDependencies || {}).length;
  
  console.log(`Production dependencies: ${totalDeps}`);
  console.log(`Development dependencies: ${totalDevDeps}`);
  console.log(`Total dependencies: ${totalDeps + totalDevDeps}`);
} catch (error) {
  console.error('Error reading package.json:', error.message);
}

// Check for unused dependencies
console.log('🧹 Checking for unused dependencies...');
try {
  execSync('npx depcheck --json', { stdio: 'pipe' });
  console.log('✅ Dependency check completed');
} catch (error) {
  console.log('⚠️ Dependency check failed, continuing...');
}

// Check bundle size
console.log('📊 Checking bundle size...');
try {
  execSync('npm run build:analyze', { stdio: 'pipe' });
  console.log('✅ Bundle analysis completed');
} catch (error) {
  console.log('⚠️ Bundle analysis failed, continuing...');
}

const endTime = Date.now();
const duration = ((endTime - startTime) / 1000).toFixed(2);

console.log(`\n⏱️ Performance check completed in ${duration}s`);
console.log('💡 Recommendations:');
console.log('  - Use "npm run build:fast" for faster builds');
console.log('  - Run "npm run clean" before building');
console.log('  - Use "npm run typecheck:fast" for quick type checking');
console.log('  - Consider removing unused dependencies');
console.log('  - Use dynamic imports for large components');
