/**
 * Basit LinkedIn şirket çekme script'i
 * Doğrudan Node.js ile çalıştırılabilir
 * 
 * Kullanım: node scripts/scrape-simple.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.APIFY_TOKEN || ''; // Set APIFY_TOKEN environment variable
const ACTOR_ID = 'od6RadQV98FOARtrp';

// Arama konfigürasyonları - location ARRAY olmalı!
const searches = [
  { keywords: ['software company'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Teknoloji' },
  { keywords: ['bank'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Finans' },
  { keywords: ['e-commerce'], location: ['Turkey'], limit: 5, sector: 'Perakende' },
  { keywords: ['automotive'], location: ['Turkey'], limit: 5, sector: 'Otomotiv' },
  { keywords: ['telecommunications'], location: ['Turkey'], limit: 5, sector: 'Telekomünikasyon' },
];

// Utility: HTTP POST
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
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Utility: HTTP GET
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    }).on('error', reject);
  });
}

// Utility: Delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Ana fonksiyon
async function main() {
  console.log('🚀 LinkedIn Şirket Çekme Başlatılıyor...\n');
  
  const results = [];
  
  for (let i = 0; i < searches.length; i++) {
    const search = searches[i];
    console.log(`\n📦 [${i + 1}/${searches.length}] Aranıyor: ${search.keywords.join(', ')} (${search.location})`);
    
    try {
      // 1. Run başlat
      const runUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${TOKEN}`;
      const runData = {
        keywords: search.keywords,
        location: search.location, // ARRAY!
        action: 'get-companies',
        limit: search.limit,
      };
      
      const run = await post(runUrl, runData);
      
      if (run.error) {
        console.log('❌ API Hatası:', run.error.message);
        continue;
      }
      
      const runId = run.data?.id;
      
      if (!runId) {
        console.log('❌ Run ID alınamadı');
        console.log('Response:', JSON.stringify(run, null, 2));
        continue;
      }
      
      console.log(`⏳ Run başlatıldı: ${runId}`);
      console.log(`🌐 Konsol: https://console.apify.com/view/runs/${runId}`);
      
      // 2. Run'ın tamamlanmasını bekle
      let status = 'RUNNING';
      let attempts = 0;
      const maxAttempts = 60; // 3 dakika max
      
      while (status !== 'SUCCEEDED' && status !== 'FAILED' && attempts < maxAttempts) {
        await delay(3000);
        attempts++;
        
        const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${TOKEN}`;
        const statusRes = await get(statusUrl);
        status = statusRes.data?.status;
        
        if (attempts % 5 === 0) {
          console.log(`   ⏳ Bekleniyor... (${attempts * 3}s) - ${status}`);
        }
      }
      
      if (status !== 'SUCCEEDED') {
        console.log(`❌ Run başarısız veya zaman aşımı: ${status}`);
        continue;
      }
      
      // 3. Sonuçları çek
      const datasetId = run.data?.defaultDatasetId;
      const itemsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}`;
      const items = await get(itemsUrl);
      
      console.log(`✅ ${items.length} şirket bulundu`);
      
      // 4. Sonuçları işle
      const companies = items.map(item => ({
        name: item.companyName,
        slug: item.companyName?.toLowerCase()
          .replace(/ı/g, 'i')
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
        initials: item.companyName?.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase()).join(''),
        description: item.description || item.headline || '',
        city: 'İstanbul',
        sector: search.sector,
        size: item.companySize || '51-200',
        status: 'Aktif',
        linkedin_url: item.url,
        website: item.website || '',
        source: 'linkedin-apify',
        scraped_at: new Date().toISOString(),
      }));
      
      results.push(...companies);
      
      // 5. Ara bekleme
      if (i < searches.length - 1) {
        console.log('😴 10 saniye bekleniyor...');
        await delay(10000);
      }
      
    } catch (error) {
      console.log(`❌ Hata: ${error.message}`);
    }
  }
  
  // Sonuçları kaydet
  const outputPath = path.join(__dirname, '../data/linkedin-companies-simple.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({
    companies: results,
    total: results.length,
    date: new Date().toISOString(),
  }, null, 2));
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ TAMAMLANDI!`);
  console.log(`📊 Toplam ${results.length} şirket çekildi`);
  console.log(`📁 Sonuçlar: ${outputPath}`);
  
  // Özet göster
  console.log(`\n🏢 Tüm Şirketler:`);
  results.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.name} (${c.sector})`);
  });
}

main().catch(console.error);
