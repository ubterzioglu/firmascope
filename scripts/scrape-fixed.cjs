/**
 * LinkedIn'den 100 kaliteli şirket çekme script'i - DÜZELTİLMİŞ VERSİYON
 * Doğru veri yapısı ile çalışır
 * 
 * Kullanım: node scripts/scrape-fixed.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.APIFY_TOKEN || ''; // Set APIFY_TOKEN env variable
const ACTOR_ID = 'od6RadQV98FOARtrp';

// Arama konfigürasyonları - her biri 5-10 şirket hedefliyor
const SEARCH_STRATEGY = [
  // Teknoloji (20 şirket)
  { keywords: ['software company'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Teknoloji' },
  { keywords: ['technology'], location: ['Ankara, Turkey'], limit: 5, sector: 'Teknoloji' },
  { keywords: ['saas'], location: ['Turkey'], limit: 5, sector: 'Teknoloji' },
  { keywords: ['fintech'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Teknoloji' },
  
  // Bankacılık & Finans (15 şirket)
  { keywords: ['bank'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Finans' },
  { keywords: ['financial services'], location: ['Turkey'], limit: 5, sector: 'Finans' },
  { keywords: ['insurance'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Finans' },
  
  // Perakende & E-ticaret (15 şirket)
  { keywords: ['e-commerce'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Perakende' },
  { keywords: ['retail'], location: ['Turkey'], limit: 5, sector: 'Perakende' },
  { keywords: ['marketplace'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Perakende' },
  
  // Otomotiv (10 şirket)
  { keywords: ['automotive'], location: ['Bursa, Turkey'], limit: 3, sector: 'Otomotiv' },
  { keywords: ['automotive'], location: ['Kocaeli, Turkey'], limit: 3, sector: 'Otomotiv' },
  { keywords: ['car manufacturing'], location: ['Turkey'], limit: 4, sector: 'Otomotiv' },
  
  // Telekomünikasyon (10 şirket)
  { keywords: ['telecommunications'], location: ['Istanbul, Turkey'], limit: 5, sector: 'Telekomünikasyon' },
  { keywords: ['telecom'], location: ['Ankara, Turkey'], limit: 5, sector: 'Telekomünikasyon' },
  
  // Havacılık (5 şirket)
  { keywords: ['airlines'], location: ['Istanbul, Turkey'], limit: 3, sector: 'Havacılık' },
  { keywords: ['aviation'], location: ['Turkey'], limit: 2, sector: 'Havacılık' },
  
  // Üretim & Sanayi (10 şirket)
  { keywords: ['manufacturing'], location: ['Istanbul, Turkey'], limit: 3, sector: 'Üretim' },
  { keywords: ['steel'], location: ['Turkey'], limit: 3, sector: 'Demir Çelik' },
  { keywords: ['textile'], location: ['Turkey'], limit: 4, sector: 'Tekstil' },
  
  // İlaç & Sağlık (5 şirket)
  { keywords: ['pharmaceutical'], location: ['Istanbul, Turkey'], limit: 3, sector: 'İlaç' },
  { keywords: ['healthcare'], location: ['Turkey'], limit: 2, sector: 'Sağlık' },
  
  // Enerji (5 şirket)
  { keywords: ['energy'], location: ['Istanbul, Turkey'], limit: 3, sector: 'Enerji' },
  { keywords: ['oil gas'], location: ['Turkey'], limit: 2, sector: 'Enerji' },
  
  // Gıda & İçecek (5 şirket)
  { keywords: ['food beverage'], location: ['Istanbul, Turkey'], limit: 3, sector: 'Gıda' },
  { keywords: ['consumer goods'], location: ['Turkey'], limit: 2, sector: 'Tüketim' },
];

// ==================== YARDIMCI FONKSİYONLAR ====================

function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateInitials(name) {
  const words = name.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function extractCity(headquarter) {
  if (!headquarter) return 'İstanbul';
  
  const cities = [
    'İstanbul', 'Istanbul',
    'Ankara',
    'İzmir', 'Izmir',
    'Bursa',
    'Antalya',
    'Adana',
    'Konya',
    'Gaziantep',
    'Kocaeli',
    'Sakarya',
    'Manisa',
    'Hatay',
    'Zonguldak'
  ];
  
  const lower = headquarter.toLowerCase();
  for (const city of cities) {
    if (lower.includes(city.toLowerCase())) {
      return city.replace(/Istanbul/g, 'İstanbul').replace(/Izmir/g, 'İzmir');
    }
  }
  
  return 'İstanbul';
}

function mapIndustryToSector(industry, defaultSector) {
  const mapping = {
    'Information Technology': 'Teknoloji',
    'Software Development': 'Teknoloji',
    'Computer Software': 'Teknoloji',
    'Internet': 'Teknoloji',
    'Financial Services': 'Finans',
    'Banking': 'Finans',
    'Insurance': 'Finans',
    'Retail': 'Perakende',
    'Automotive': 'Otomotiv',
    'Airlines/Aviation': 'Havacılık',
    'Telecommunications': 'Telekomünikasyon',
    'Health Care': 'Sağlık',
    'Pharmaceuticals': 'İlaç',
    'Food & Beverages': 'Gıda',
    'Oil & Energy': 'Enerji',
    'Manufacturing': 'Üretim',
  };
  
  return mapping[industry] || defaultSector;
}

function normalizeCompanySize(employeeCount) {
  if (!employeeCount) return '51-200';
  
  // LinkedIn'den gelen format: "10001+" veya "501-1000" veya number
  const str = employeeCount.toString();
  
  // Number ise (örn: 5000)
  const num = parseInt(str);
  if (!isNaN(num)) {
    if (num >= 10001) return '10000+';
    if (num >= 5001) return '5001-10000';
    if (num >= 1001) return '1001-5000';
    if (num >= 501) return '501-1000';
    if (num >= 201) return '201-500';
    if (num >= 51) return '51-200';
    if (num >= 11) return '11-50';
    return '1-10';
  }
  
  // String ise (örn: "10001+" veya "501-1000")
  if (str.includes('10001')) return '10000+';
  if (str.includes('5001')) return '5001-10000';
  if (str.includes('1001')) return '1001-5000';
  if (str.includes('501')) return '501-1000';
  if (str.includes('201')) return '201-500';
  if (str.includes('51')) return '51-200';
  if (str.includes('11')) return '11-50';
  if (str.includes('1-10')) return '1-10';
  
  return '51-200';
}

function isQualityCompany(item) {
  if (!item.name || item.name.length < 2) return false;
  
  // Freelance/şahıs şirketlerini filtrele
  const lowerName = item.name.toLowerCase();
  if (lowerName.includes('freelance')) return false;
  if (lowerName.includes('self-employed')) return false;
  if (lowerName.includes('consultant') && !item.employeeCount) return false;
  
  // Minimum takipçi (1000+) - followerCount string veya number olabilir
  let followers = 0;
  if (item.followerCount) {
    if (typeof item.followerCount === 'string') {
      followers = parseInt(item.followerCount.replace(/[^0-9]/g, '')) || 0;
    } else if (typeof item.followerCount === 'number') {
      followers = item.followerCount;
    }
  }
  if (followers < 1000) return false;
  
  return true;
}

// ==================== API FONKSİYONLARI ====================

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

// ==================== ANA FONKSİYON ====================

async function scrapeCompanies(searchConfig, retryCount = 0) {
  const { keywords, location, limit } = searchConfig;
  
  log(`🔍 Aranıyor: "${keywords.join(', ')}" in ${location[0]} (limit: ${limit})`);
  
  try {
    // 1. Run başlat
    const runUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${TOKEN}`;
    const runData = {
      keywords,
      location, // ARRAY!
      action: 'get-companies',
      limit,
    };
    
    const run = await post(runUrl, runData);
    
    if (run.error) {
      throw new Error(run.error.message);
    }
    
    const runId = run.data?.id;
    if (!runId) {
      throw new Error('Run ID alınamadı');
    }
    
    log(`⏳ Run: ${runId}`);
    
    // 2. Run'ın tamamlanmasını bekle
    let status = 'RUNNING';
    let attempts = 0;
    const maxAttempts = 60;
    
    while (status !== 'SUCCEEDED' && status !== 'FAILED' && attempts < maxAttempts) {
      await delay(3000);
      attempts++;
      
      const statusRes = await get(`https://api.apify.com/v2/actor-runs/${runId}?token=${TOKEN}`);
      status = statusRes.data?.status;
      
      if (attempts % 5 === 0) {
        log(`   Bekleniyor... (${attempts * 3}s) - ${status}`);
      }
    }
    
    if (status !== 'SUCCEEDED') {
      throw new Error(`Run başarısız: ${status}`);
    }
    
    // 3. Sonuçları çek
    const datasetId = run.data?.defaultDatasetId;
    const items = await get(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${TOKEN}`);
    
    const validCompanies = items.filter(isQualityCompany);
    log(`✅ ${validCompanies.length} kaliteli şirket (toplam: ${items.length})`, 'success');
    
    return {
      companies: validCompanies,
      runId,
      error: null,
    };
    
  } catch (error) {
    log(`❌ Hata: ${error.message}`, 'error');
    
    if (retryCount < 3) {
      log(`🔄 Yeniden deneniyor (${retryCount + 1}/3)...`, 'warning');
      await delay(5000);
      return scrapeCompanies(searchConfig, retryCount + 1);
    }
    
    return { companies: [], runId: '', error: error.message };
  }
}

function convertToFirmascopeFormat(item, defaultSector) {
  return {
    name: item.name.trim(),
    slug: generateSlug(item.name),
    initials: generateInitials(item.name),
    description: item.description || item.tagline || '',
    city: extractCity(item.headquarter),
    sector: mapIndustryToSector(item.industry, defaultSector),
    size: normalizeCompanySize(item.employeeCount),
    status: 'Aktif',
    website: item.websiteUrl || '',
    linkedin_url: item.url,
    logo_url: item.avatar || '',
    source: 'linkedin-apify',
    scraped_at: new Date().toISOString(),
  };
}

// ==================== MAIN ====================

async function main() {
  log('🚀 LinkedIn Şirket Çekme Başlatılıyor...');
  log(`🎯 Hedef: 100 şirket`);
  log(`📦 Toplam ${SEARCH_STRATEGY.length} arama yapılacak\n`);
  
  // Output dizini
  const outputDir = path.join(__dirname, '../data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'linkedin-companies-100.json');
  
  // Mevcut sonuçları yükle
  let allCompanies = [];
  let existingSlugs = new Set();
  
  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      allCompanies = existing.companies || [];
      existingSlugs = new Set(allCompanies.map(c => c.slug));
      log(`📂 Mevcut ${allCompanies.length} şirket yüklendi`);
    } catch {
      log('⚠️ Mevcut dosya okunamadı, sıfırdan başlanıyor', 'warning');
    }
  }
  
  // Her arama konfigürasyonunu işle
  for (let i = 0; i < SEARCH_STRATEGY.length; i++) {
    const search = SEARCH_STRATEGY[i];
    
    // Hedefe ulaştık mı?
    if (allCompanies.length >= 100) {
      log(`🎉 Hedefe ulaşıldı! (${allCompanies.length} şirket)`, 'success');
      break;
    }
    
    log(`\n📦 [${i + 1}/${SEARCH_STRATEGY.length}] ${search.sector} - ${allCompanies.length}/100`);
    
    const result = await scrapeCompanies(search);
    
    if (result.companies.length > 0) {
      // Dönüştür ve ekle
      const newCompanies = result.companies
        .map(c => convertToFirmascopeFormat(c, search.sector))
        .filter(c => !existingSlugs.has(c.slug));
      
      for (const company of newCompanies) {
        allCompanies.push(company);
        existingSlugs.add(company.slug);
      }
      
      log(`➕ ${newCompanies.length} yeni şirket eklendi`, 'success');
    }
    
    // Kaydet
    fs.writeFileSync(outputPath, JSON.stringify({
      companies: allCompanies,
      metadata: {
        total: allCompanies.length,
        target: 100,
        lastUpdate: new Date().toISOString(),
      }
    }, null, 2));
    
    // Rate limiting - 10 saniye bekle
    if (i < SEARCH_STRATEGY.length - 1 && allCompanies.length < 100) {
      log('😴 10 saniye bekleniyor...');
      await delay(10000);
    }
  }
  
  // Final özet
  log(`\n${'='.repeat(60)}`);
  log(`✅ TAMAMLANDI!`, 'success');
  log(`📊 Toplam: ${allCompanies.length} şirket`);
  log(`📁 Kayıt: ${outputPath}`);
  
  // Sektör dağılımı
  const sectors = {};
  for (const c of allCompanies) {
    sectors[c.sector] = (sectors[c.sector] || 0) + 1;
  }
  
  log(`\n📈 Sektör Dağılımı:`);
  Object.entries(sectors)
    .sort((a, b) => b[1] - a[1])
    .forEach(([sector, count]) => {
      log(`   ${sector}: ${count}`);
    });
  
  // İlk 20 şirket
  log(`\n🏢 İlk 20 Şirket:`);
  allCompanies.slice(0, 20).forEach((c, i) => {
    log(`   ${i + 1}. ${c.name} (${c.sector}, ${c.city})`);
  });
  
  if (allCompanies.length > 20) {
    log(`   ... ve ${allCompanies.length - 20} şirket daha`);
  }
}

main().catch(err => {
  log(`💥 Fatal error: ${err.message}`, 'error');
  process.exit(1);
});
