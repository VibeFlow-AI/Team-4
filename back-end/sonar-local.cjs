const fs = require('fs');
const path = require('path');

console.log('🔍 SonarQube Local Analysis Setup');
console.log('================================');

// Check if sonar-project.properties exists
const sonarConfigPath = path.join(__dirname, '..', 'sonar-project.properties');
if (fs.existsSync(sonarConfigPath)) {
  console.log('✅ sonar-project.properties found');
  const config = fs.readFileSync(sonarConfigPath, 'utf8');
  console.log('📋 Configuration:');
  console.log(config);
} else {
  console.log('❌ sonar-project.properties not found');
}

// Check source directory
const srcPath = path.join(__dirname, 'src');
if (fs.existsSync(srcPath)) {
  console.log('✅ Source directory found:', srcPath);
} else {
  console.log('❌ Source directory not found:', srcPath);
}

// Check tests directory
const testsPath = path.join(__dirname, 'src', '__tests__');
if (fs.existsSync(testsPath)) {
  console.log('✅ Tests directory found:', testsPath);
} else {
  console.log('⚠️  Tests directory not found (will be created when needed):', testsPath);
}

console.log('\n🎯 SonarQube Local Analysis is ready!');
console.log('To run actual analysis, you need:');
console.log('1. SonarQube server running on localhost:9000');
console.log('2. Set SONAR_TOKEN environment variable');
console.log('3. Run: npm run sonar:local'); 