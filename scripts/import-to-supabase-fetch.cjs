/**
 * LinkedIn'den çekilen şirketleri Supabase'e aktarma (Fetch API ile)
 * 
 * Kullanım: node scripts/import-to-supabase-fetch.cjs
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Supabase bilgileri
const SUPABASE_URL = 'https://feafcmvulxsrjrdxosyt.supabase.co'.trim();
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYWZjbXZ1bHhzcmpyZHhvc3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyMzg1NDYsImV4cCI6MjA4NDgxNDU0Nn0.q-s1Kmd9QQKwUX6hOwQuzipuaiZhUrihaBYcZsllel4';

// Fetch fonksiyonu
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = options.body ? JSON.stringify(options.body) : null;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...options.headers,
      },
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(data)),
            text: () => Promise.resolve(data),
          });
        } catch {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            text: () => Promise.resolve(data),
          });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('🚀 Supabase\'e Aktarma Başlatılıyor...\n');
  
  // 1. JSON dosyasını oku
  const jsonPath = path.join(__dirname, '../data/linkedin-turkey-100.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ JSON dosyası bulunamadı:', jsonPath);
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const linkedinCompanies = data.companies || [];
  
  console.log(`📊 LinkedIn'den ${linkedinCompanies.length} şirket okundu`);
  
  // 2. Mevcut şirketleri çek
  console.log('📥 Mevcut şirketler çekiliyor...');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/companies?select=slug,name`);
  const existingCompanies = await response.json();
  
  if (!response.ok) {
    console.error('❌ Mevcut şirketleri çekerken hata:', existingCompanies);
    process.exit(1);
  }
  
  const existingSlugs = new Set(existingCompanies.map(c => c.slug));
  console.log(`   ${existingCompanies.length} mevcut şirket bulundu`);
  
  // 3. Yeni şirketleri filtrele
  const newCompanies = linkedinCompanies.filter(c => !existingSlugs.has(c.slug));
  
  if (newCompanies.length === 0) {
    console.log('✅ Tüm şirketler zaten veritabanında!');
    return;
  }
  
  console.log(`\n➕ ${newCompanies.length} yeni şirket eklenecek`);
  console.log('\nİlk 5 şirket:');
  newCompanies.slice(0, 5).forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.name} (${c.sector})`);
  });
  if (newCompanies.length > 5) {
    console.log(`   ... ve ${newCompanies.length - 5} şirket daha`);
  }
  
  // 4. Supabase'e ekle
  console.log('\n💾 Veritabanına yazılıyor...');
  
  const BATCH_SIZE = 50;
  let insertedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < newCompanies.length; i += BATCH_SIZE) {
    const batch = newCompanies.slice(i, i + BATCH_SIZE);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/companies`, {
      method: 'POST',
      headers: {
        'Prefer': 'resolution=merge-duplicates',
      },
      body: batch,
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`   ❌ Batch hatası:`, error.substring(0, 200));
      errorCount += batch.length;
    } else {
      insertedCount += batch.length;
      console.log(`   ✅ ${insertedCount}/${newCompanies.length} şirket eklendi`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // 5. Özet
  console.log(`\n${'='.repeat(60)}`);
  console.log('✅ AKTARIM TAMAMLANDI!');
  console.log(`📊 Yeni eklenen: ${insertedCount} şirket`);
  if (errorCount > 0) {
    console.log(`❌ Hatalı: ${errorCount} şirket`);
  }
  console.log(`📁 Veritabanındaki toplam: ${existingCompanies.length + insertedCount} şirket`);
  
  // 6. Sektör dağılımı
  console.log('\n📈 Yeni Şirketler - Sektör Dağılımı:');
  const sectors = {};
  newCompanies.forEach(c => {
    sectors[c.sector] = (sectors[c.sector] || 0) + 1;
  });
  Object.entries(sectors)
    .sort((a, b) => b[1] - a[1])
    .forEach(([sector, count]) => {
      console.log(`   ${sector}: ${count}`);
    });
}

main().catch(err => {
  console.error('💥 Fatal error:', err.message);
  process.exit(1);
});
