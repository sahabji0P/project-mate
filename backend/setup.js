const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
    console.log('✅ Logs directory created');
} else {
    console.log('✅ Logs directory already exists');
}

console.log('\n📦 Setup complete! You can now run:');
console.log('   npm run dev    (for development)');
console.log('   npm start      (for production)\n');