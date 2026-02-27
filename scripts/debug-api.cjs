const https = require('https');

const TOKEN = process.env.APIFY_TOKEN || ''; // Set APIFY_TOKEN env variable
const ACTOR_ID = 'od6RadQV98FOARtrp';

const postData = JSON.stringify({
  keywords: ['software'],
  location: 'Turkey',
  action: 'get-companies',
  limit: 2,
});

const options = {
  hostname: 'api.apify.com',
  path: `/v2/acts/${ACTOR_ID}/runs?token=${TOKEN}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('Sending request to:', options.hostname + options.path);
console.log('Data:', postData);

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('\nResponse Body:');
    try {
      const parsed = JSON.parse(body);
      console.log(JSON.stringify(parsed, null, 2));
    } catch {
      console.log(body);
    }
  });
});

req.on('error', (e) => {
  console.error('Request Error:', e.message);
});

req.write(postData);
req.end();
