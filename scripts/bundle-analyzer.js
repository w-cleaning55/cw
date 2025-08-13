#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 Bundle Analyzer Starting...');

// Check if bundle analyzer is installed
try {
  require.resolve('webpack-bundle-analyzer');
} catch (error) {
  console.log('📦 Installing webpack-bundle-analyzer...');
  try {
    execSync('npm install --save-dev webpack-bundle-analyzer', { stdio: 'inherit' });
    console.log('✅ webpack-bundle-analyzer installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install webpack-bundle-analyzer:', installError.message);
    process.exit(1);
  }
}

// Run bundle analysis
console.log('🔍 Analyzing bundle...');
try {
  execSync('npm run build:analyze', { stdio: 'inherit' });
  console.log('✅ Bundle analysis completed');
  
  // Check if analysis file was created
  const analysisFile = path.join(__dirname, '../bundle-analysis.html');
  if (fs.existsSync(analysisFile)) {
    console.log('📁 Bundle analysis report created at:', analysisFile);
    console.log('🌐 Open this file in your browser to view the analysis');
  }
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}

console.log('\n💡 Bundle Analysis Tips:');
console.log('  - Look for large packages that can be lazy-loaded');
console.log('  - Check for duplicate dependencies');
console.log('  - Identify unused code that can be tree-shaken');
console.log('  - Consider code-splitting for large components');
console.log('  - Use dynamic imports for routes and heavy components');
