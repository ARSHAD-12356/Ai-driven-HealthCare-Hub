/**
 * Admin Initialization Script
 * 
 * Run this script to initialize the admin user:
 * node scripts/init-admin.js
 * 
 * Or visit: http://localhost:3000/admin/init
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/init',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (res.statusCode === 200) {
        console.log('✅ Admin initialized successfully!');
        console.log('Response:', response);
      } else {
        console.error('❌ Failed to initialize admin:', response);
      }
    } catch (e) {
      console.log('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.error('Make sure your Next.js server is running on port 3000');
});

req.end();

