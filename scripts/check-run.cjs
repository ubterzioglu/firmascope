const https = require('https');
const TOKEN = process.env.APIFY_TOKEN || ''; // Set APIFY_TOKEN environment variable

const runIds = [
  'idDEkRFAt2OkmJgev',
  'r3f1QYFrDhnq8nOnN',
];

function getRun(runId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.apify.com/v2/actor-runs/${runId}?token=${TOKEN}`;
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const runId of runIds) {
    console.log(`\nRun: ${runId}`);
    console.log('='.repeat(50));
    
    try {
      const result = await getRun(runId);
      const data = result.data;
      
      console.log('Status:', data?.status);
      console.log('Dataset ID:', data?.defaultDatasetId);
      console.log('KVS ID:', data?.defaultKeyValueStoreId);
      
      // Dataset'ten veri çek
      const datasetId = data?.defaultDatasetId;
      if (datasetId) {
        const itemsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}`;
        https.get(itemsUrl, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try {
              const items = JSON.parse(body);
              console.log('Item sayısı:', items.length);
              if (items.length > 0) {
                console.log('İlk item keys:', Object.keys(items[0]).join(', '));
              }
            } catch (e) {
              console.log('Parse hatası:', body.substring(0, 200));
            }
          });
        });
      }
    } catch (e) {
      console.error('Hata:', e.message);
    }
  }
}

main();
