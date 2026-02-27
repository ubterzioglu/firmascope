const https = require('https');
const TOKEN = process.env.APIFY_TOKEN || ''; // Set APIFY_TOKEN env variable

// Son run'ların dataset ID'leri
const datasetIds = [
  'idDEkRFAt2OkmJgev', // Software
  'r3f1QYFrDhnq8nOnN', // Bank
];

function getDataset(datasetId) {
  return new Promise((resolve, reject) => {
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}`;
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
  for (const datasetId of datasetIds) {
    console.log(`\nDataset: ${datasetId}`);
    console.log('='.repeat(50));
    
    try {
      const items = await getDataset(datasetId);
      console.log(`Toplam: ${items.length} item`);
      
      if (items.length > 0) {
        console.log('\nİlk item keys:', Object.keys(items[0]).join(', '));
        console.log('\nİlk item:');
        console.log(JSON.stringify(items[0], null, 2));
      }
    } catch (e) {
      console.error('Hata:', e.message);
    }
  }
}

main();
