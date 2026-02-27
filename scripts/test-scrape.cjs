const https = require('https');

const TOKEN = process.env.APIFY_TOKEN || ''; // Set APIFY_TOKEN env variable
const ACTOR_ID = 'od6RadQV98FOARtrp';

function post(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch { resolve(body); }
      });
    }).on('error', reject);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🧪 Test: LinkedIn API\n');
  
  // 1. Run başlat
  console.log('1️⃣ Run başlatılıyor...');
  const run = await post(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${TOKEN}`,
    {
      keywords: ['trendyol'],
      location: ['Turkey'],
      action: 'get-companies',
      limit: 5,
    }
  );
  
  if (run.error) {
    console.log('❌ Hata:', run.error.message);
    return;
  }
  
  const runId = run.data?.id;
  console.log('✅ Run ID:', runId);
  
  // 2. Tamamlanmasını bekle
  console.log('2️⃣ Tamamlanması bekleniyor...');
  let status = 'RUNNING';
  while (status !== 'SUCCEEDED' && status !== 'FAILED') {
    await delay(3000);
    const statusRes = await get(`https://api.apify.com/v2/actor-runs/${runId}?token=${TOKEN}`);
    status = statusRes.data?.status;
    console.log('   Status:', status);
  }
  
  // 3. Sonuçları çek
  console.log('3️⃣ Sonuçlar çekiliyor...');
  const datasetId = run.data?.defaultDatasetId;
  const items = await get(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}`);
  
  console.log(`\n✅ ${items.length} şirket bulundu\n`);
  
  if (items.length > 0) {
    console.log('📊 İlk şirket yapısı:');
    const first = items[0];
    console.log(JSON.stringify(first, null, 2));
  }
}

main().catch(console.error);
