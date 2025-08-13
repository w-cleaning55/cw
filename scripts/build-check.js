#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Production Build Check...\n');

const checks = [
  {
    name: 'Environment Variables',
    check: () => {
      const requiredEnvVars = [
        'NODE_ENV',
        'JWT_SECRET'
      ];
      
      const missing = requiredEnvVars.filter(env => !process.env[env]);
      
      if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
      }
      
      if (process.env.NODE_ENV !== 'production') {
        console.warn('⚠️  NODE_ENV is not set to "production"');
      }
      
      return '✅ All required environment variables present';
    }
  },
  {
    name: 'TypeScript Compilation',
    check: () => {
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        return '✅ TypeScript compilation successful';
      } catch (error) {
        throw new Error(`TypeScript compilation failed: ${error.message}`);
      }
    }
  },
  {
    name: 'Next.js Build',
    check: () => {
      try {
        execSync('npm run build', { stdio: 'pipe' });
        return '✅ Next.js build successful';
      } catch (error) {
        throw new Error(`Next.js build failed: ${error.message}`);
      }
    }
  },
  {
    name: 'Bundle Size Analysis',
    check: () => {
      const buildPath = path.join(process.cwd(), '.next');
      
      if (!fs.existsSync(buildPath)) {
        throw new Error('Build directory not found');
      }
      
      // Check for large bundle sizes
      const staticPath = path.join(buildPath, 'static');
      if (fs.existsSync(staticPath)) {
        const files = fs.readdirSync(staticPath, { recursive: true });
        const largeFiles = files.filter(file => {
          const filePath = path.join(staticPath, file);
          if (fs.statSync(filePath).isFile()) {
            const stats = fs.statSync(filePath);
            return stats.size > 1024 * 1024; // 1MB
          }
          return false;
        });
        
        if (largeFiles.length > 0) {
          console.warn(`⚠️  Large files detected: ${largeFiles.join(', ')}`);
        }
      }
      
      return '✅ Bundle size analysis complete';
    }
  },
  {
    name: 'API Routes Validation',
    check: () => {
      const apiPath = path.join(process.cwd(), 'app', 'api');
      
      if (!fs.existsSync(apiPath)) {
        throw new Error('API directory not found');
      }
      
      const validateApiFile = (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for proper error handling
        if (!content.includes('try') || !content.includes('catch')) {
          console.warn(`⚠️  ${filePath} may lack proper error handling`);
        }
        
        // Check for input validation
        if (!content.includes('validate') && !content.includes('schema')) {
          console.warn(`⚠️  ${filePath} may lack input validation`);
        }
      };
      
      const findApiFiles = (dir) => {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            findApiFiles(filePath);
          } else if (file === 'route.ts' || file === 'route.js') {
            validateApiFile(filePath);
          }
        });
      };
      
      findApiFiles(apiPath);
      
      return '✅ API routes validation complete';
    }
  },
  {
    name: 'Security Check',
    check: () => {
      const securityIssues = [];
      
      // Check for hardcoded secrets
      const scanForSecrets = (dir) => {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            scanForSecrets(filePath);
          } else if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.tsx') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Simple checks for potential secrets
            const secretPatterns = [
              /password\s*=\s*['"].*['"]/i,
              /secret\s*=\s*['"].*['"]/i,
              /token\s*=\s*['"].*['"]/i,
              /api_key\s*=\s*['"].*['"]/i
            ];
            
            secretPatterns.forEach(pattern => {
              if (pattern.test(content)) {
                securityIssues.push(`Potential hardcoded secret in ${filePath}`);
              }
            });
          }
        });
      };
      
      scanForSecrets(process.cwd());
      
      if (securityIssues.length > 0) {
        console.warn('⚠️  Security issues found:');
        securityIssues.forEach(issue => console.warn(`   ${issue}`));
      }
      
      return '✅ Security check complete';
    }
  },
  {
    name: 'Performance Check',
    check: () => {
      const performanceIssues = [];
      
      // Check for common performance issues
      const checkPerformance = (dir) => {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            checkPerformance(filePath);
          } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Check for missing key props in lists
            if (content.includes('.map(') && !content.includes('key=')) {
              performanceIssues.push(`Missing key prop in ${filePath}`);
            }
            
            // Check for inline functions in JSX
            if (content.includes('onClick={() =>') || content.includes('onChange={() =>')) {
              performanceIssues.push(`Inline functions detected in ${filePath} (consider useCallback)`);
            }
          }
        });
      };
      
      checkPerformance(path.join(process.cwd(), 'components'));
      checkPerformance(path.join(process.cwd(), 'app'));
      
      if (performanceIssues.length > 0) {
        console.warn('⚠️  Performance issues found:');
        performanceIssues.forEach(issue => console.warn(`   ${issue}`));
      }
      
      return '✅ Performance check complete';
    }
  }
];

// Run all checks
let allPassed = true;
const results = [];

for (const { name, check } of checks) {
  try {
    console.log(`🔍 Checking ${name}...`);
    const result = check();
    results.push({ name, status: 'passed', message: result });
    console.log(`   ${result}\n`);
  } catch (error) {
    allPassed = false;
    results.push({ name, status: 'failed', message: error.message });
    console.error(`   ❌ ${error.message}\n`);
  }
}

// Summary
console.log('\n📊 Build Check Summary:');
console.log('========================');

results.forEach(({ name, status, message }) => {
  const icon = status === 'passed' ? '✅' : '❌';
  console.log(`${icon} ${name}: ${status}`);
});

if (allPassed) {
  console.log('\n🎉 All checks passed! Ready for production deployment.');
  process.exit(0);
} else {
  console.log('\n💥 Some checks failed. Please fix the issues before deploying.');
  process.exit(1);
}
