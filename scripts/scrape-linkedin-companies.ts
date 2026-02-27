/**
 * LinkedIn'den 100 kaliteli şirket çekme script'i
 * Yavaş ve güvenli çalışır - rate limiting'e dikkat eder
 * 
 * Kullanım: npx tsx scripts/scrape-linkedin-companies.ts
 */

import { ApifyClient } from 'apify-client';
import * as fs from 'fs';
import * as path from 'path';

// ==================== KONFİGÜRASYON ====================

const APIFY_TOKEN = process.env.APIFY_TOKEN || ''; // Set APIFY_TOKEN env variable

// Output dosyası (önce JSON'a kaydet, sonra Supabase'e)
const OUTPUT_FILE = path.join(__dirname, '../data/linkedin-companies.json');
const LOG_FILE = path.join(__dirname, '../data/scrape-log.txt');

// Rate limiting ayarları
const CONFIG = {
  batchSize: 5,           // Her seferde 5 şirket
  delayBetweenBatches: 10000, // 10 saniye bekle
  maxRetries: 3,          // Hata durumunda 3 deneme
  totalTarget: 100,       // Hedef: 100 şirket
};

// ==================== ARAMA STRATEJİSİ ====================

// Kaliteli şirketler için optimize edilmiş arama kelimeleri
const SEARCH_STRATEGY = [
  // Teknoloji (20 şirket)
  { keywords: ['software company'], location: 'Istanbul, Turkey', limit: 5, sector: 'Teknoloji' },
  { keywords: ['technology'], location: 'Ankara, Turkey', limit: 5, sector: 'Teknoloji' },
  { keywords: ['saas startup'], location: 'Turkey', limit: 5, sector: 'Teknoloji' },
  { keywords: ['fintech'], location: 'Istanbul, Turkey', limit: 5, sector: 'Finans' },
  
  // Bankacılık & Finans (15 şirket)
  { keywords: ['bank'], location: 'Istanbul, Turkey', limit: 5, sector: 'Finans' },
  { keywords: ['financial services'], location: 'Turkey', limit: 5, sector: 'Finans' },
  { keywords: ['insurance'], location: 'Istanbul, Turkey', limit: 5, sector: 'Finans' },
  
  // Perakende & E-ticaret (15 şirket)
  { keywords: ['e-commerce'], location: 'Istanbul, Turkey', limit: 5, sector: 'Perakende' },
  { keywords: ['retail'], location: 'Turkey', limit: 5, sector: 'Perakende' },
  { keywords: ['marketplace'], location: 'Istanbul, Turkey', limit: 5, sector: 'Perakende' },
  
  // Otomotiv (10 şirket)
  { keywords: ['automotive'], location: 'Bursa, Turkey', limit: 3, sector: 'Otomotiv' },
  { keywords: ['automotive'], location: 'Kocaeli, Turkey', limit: 3, sector: 'Otomotiv' },
  { keywords: ['car manufacturing'], location: 'Turkey', limit: 4, sector: 'Otomotiv' },
  
  // Telekomünikasyon (10 şirket)
  { keywords: ['telecommunications'], location: 'Istanbul, Turkey', limit: 5, sector: 'Telekomünikasyon' },
  { keywords: ['telecom'], location: 'Ankara, Turkey', limit: 5, sector: 'Telekomünikasyon' },
  
  // Havacılık (5 şirket)
  { keywords: ['airlines'], location: 'Istanbul, Turkey', limit: 3, sector: 'Havacılık' },
  { keywords: ['aviation'], location: 'Turkey', limit: 2, sector: 'Havacılık' },
  
  // Üretim & Sanayi (10 şirket)
  { keywords: ['manufacturing'], location: 'Istanbul, Turkey', limit: 3, sector: 'Üretim' },
  { keywords: ['steel'], location: 'Turkey', limit: 3, sector: 'Demir Çelik' },
  { keywords: ['textile'], location: 'Turkey', limit: 4, sector: 'Tekstil' },
  
  // İlaç & Sağlık (5 şirket)
  { keywords: ['pharmaceutical'], location: 'Istanbul, Turkey', limit: 3, sector: 'İlaç' },
  { keywords: ['healthcare'], location: 'Turkey', limit: 2, sector: 'Sağlık' },
  
  // Enerji (5 şirket)
  { keywords: ['energy'], location: 'Istanbul, Turkey', limit: 3, sector: 'Enerji' },
  { keywords: ['oil gas'], location: 'Turkey', limit: 2, sector: 'Enerji' },
  
  // Gıda & İçecek (5 şirket)
  { keywords: ['food beverage'], location: 'Istanbul, Turkey', limit: 3, sector: 'Gıda' },
  { keywords: ['consumer goods'], location: 'Turkey', limit: 2, sector: 'Tüketim' },
];

// ==================== TİPLER ====================

interface LinkedInCompany {
  url: string;
  companyName: string;
  headline?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  founded?: string;
  specialties?: string[];
  website?: string;
  followers?: string;
  employeesOnLinkedIn?: string;
}

interface FirmascopeCompany {
  name: string;
  slug: string;
  initials: string;
  description?: string;
  city?: string;
  sector?: string;
  size?: string;
  status: string;
  logo_url?: string;
  website?: string;
  linkedin_url?: string;
  source: string;
  scraped_at: string;
}

interface ScrapeResult {
  searchConfig: any;
  companies: LinkedInCompany[];
  runId: string;
  timestamp: string;
  error?: string;
}

// ==================== YARDIMCI FONKSİYONLAR ====================

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
  const timestamp = new Date().toISOString();
  const icons = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
  };
  
  const logMessage = `${icons[type]} [${timestamp}] ${message}`;
  console.log(logMessage);
  
  // Dosyaya da kaydet
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateSlug(name: string): string {
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

function generateInitials(name: string): string {
  const words = name.split(/\s+/).filter(w => w.length > 0);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function extractCity(headquarters: string): string {
  if (!headquarters) return 'İstanbul';
  
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
  
  const lower = headquarters.toLowerCase();
  for (const city of cities) {
    if (lower.includes(city.toLowerCase())) {
      return city
        .replace(/Istanbul/g, 'İstanbul')
        .replace(/Izmir/g, 'İzmir');
    }
  }
  
  return 'İstanbul';
}

function mapIndustryToSector(industry: string, defaultSector: string): string {
  const mapping: Record<string, string> = {
    'Information Technology': 'Teknoloji',
    'Software Development': 'Teknoloji',
    'Computer Software': 'Teknoloji',
    'Internet': 'Teknoloji',
    'Financial Services': 'Finans',
    'Banking': 'Finans',
    'Investment Banking': 'Finans',
    'Insurance': 'Finans',
    'Retail': 'Perakende',
    'E-commerce': 'Perakende',
    'Automotive': 'Otomotiv',
    'Motor Vehicle Manufacturing': 'Otomotiv',
    'Airlines/Aviation': 'Havacılık',
    'Aviation & Aerospace': 'Havacılık',
    'Telecommunications': 'Telekomünikasyon',
    'Health Care': 'Sağlık',
    'Hospital & Health Care': 'Sağlık',
    'Pharmaceuticals': 'İlaç',
    'Pharmaceutical Manufacturing': 'İlaç',
    'Food & Beverages': 'Gıda',
    'Food Production': 'Gıda',
    'Oil & Energy': 'Enerji',
    'Utilities': 'Enerji',
    'Steel': 'Demir Çelik',
    'Mining & Metals': 'Demir Çelik',
    'Textiles': 'Tekstil',
    'Apparel & Fashion': 'Tekstil',
    'Manufacturing': 'Üretim',
    'Industrial Automation': 'Üretim',
    'Consumer Goods': 'Tüketim',
    'Consumer Services': 'Tüketim',
    'Logistics': 'Lojistik',
    'Transportation': 'Lojistik',
    'Construction': 'İnşaat',
    'Real Estate': 'Gayrimenkul',
    'Media': 'Medya',
    'Broadcast Media': 'Medya',
    'Education': 'Eğitim',
    'Higher Education': 'Eğitim',
    'Defense & Space': 'Savunma',
    'Government': 'Kamu',
    'Non-profit': 'Sivil Toplum',
  };
  
  return mapping[industry] || defaultSector;
}

function normalizeCompanySize(size: string): string {
  if (!size) return '51-200';
  
  const sizeStr = size.toString().toLowerCase();
  
  if (sizeStr.includes('10001') || sizeStr.includes('10,001')) return '10000+';
  if (sizeStr.includes('5001') || sizeStr.includes('5,001')) return '5001-10000';
  if (sizeStr.includes('1001') || sizeStr.includes('1,001')) return '1001-5000';
  if (sizeStr.includes('501') || sizeStr.includes('501')) return '501-1000';
  if (sizeStr.includes('201') || sizeStr.includes('201')) return '201-500';
  if (sizeStr.includes('51')) return '51-200';
  if (sizeStr.includes('11')) return '11-50';
  if (sizeStr.includes('1-10')) return '1-10';
  if (sizeStr.includes('self-employed')) return '1-10';
  
  return '51-200';
}

function isQualityCompany(company: LinkedInCompany): boolean {
  // Kalite filtreleri
  if (!company.companyName || company.companyName.length < 2) return false;
  if (company.companyName.toLowerCase().includes('freelance')) return false;
  if (company.companyName.toLowerCase().includes('self-employed')) return false;
  
  // Minimum takipçi sayısı (1000+)
  const followers = company.followers || '';
  const followerNum = parseInt(followers.replace(/[^0-9]/g, ''));
  if (followerNum < 1000 && !company.companySize?.includes('1000')) return false;
  
  return true;
}

// ==================== ANA FONKSİYONLAR ====================

async function scrapeCompanies(
  apifyClient: ApifyClient,
  searchConfig: any,
  retryCount = 0
): Promise<ScrapeResult> {
  const { keywords, location, limit } = searchConfig;
  
  log(`🔍 Aranıyor: "${keywords.join(', ')}" in ${location} (limit: ${limit})`);
  
  try {
    // Actor'ü çalıştır
    const run = await apifyClient
      .actor('od6RadQV98FOARtrp')
      .start({
        keywords,
        location,
        action: 'get-companies',
        limit,
      });

    log(`⏳ Run başlatıldı: ${run.id}`, 'info');
    
    // Run'ın tamamlanmasını bekle
    let runStatus = await apifyClient.run(run.id).get();
    let waitTime = 0;
    const maxWaitTime = 5 * 60 * 1000; // 5 dakika max bekle
    
    while (runStatus?.status !== 'SUCCEEDED' && runStatus?.status !== 'FAILED') {
      if (waitTime > maxWaitTime) {
        throw new Error('Run zaman aşımına uğradı');
      }
      
      await delay(3000); // 3 saniye bekle
      waitTime += 3000;
      runStatus = await apifyClient.run(run.id).get();
      
      if (waitTime % 15000 === 0) { // Her 15 saniyede bir log
        log(`⏳ Hala çalışıyor... (${Math.round(waitTime / 1000)}s) - Durum: ${runStatus?.status}`);
      }
    }

    if (runStatus.status === 'FAILED') {
      throw new Error(`Run başarısız: ${runStatus.exitCode}`);
    }

    // Sonuçları çek
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    const validCompanies = (items as LinkedInCompany[]).filter(isQualityCompany);
    
    log(`✅ ${validCompanies.length} kaliteli şirket bulundu (toplam: ${items.length})`, 'success');

    return {
      searchConfig,
      companies: validCompanies,
      runId: run.id,
      timestamp: new Date().toISOString(),
    };

  } catch (error: any) {
    log(`❌ Hata: ${error.message}`, 'error');
    
    // Retry logic
    if (retryCount < CONFIG.maxRetries) {
      log(`🔄 Yeniden deneniyor (${retryCount + 1}/${CONFIG.maxRetries})...`, 'warning');
      await delay(5000);
      return scrapeCompanies(apifyClient, searchConfig, retryCount + 1);
    }
    
    return {
      searchConfig,
      companies: [],
      runId: '',
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}

function convertToFirmascopeFormat(
  linkedInCompany: LinkedInCompany,
  defaultSector: string
): FirmascopeCompany {
  return {
    name: linkedInCompany.companyName.trim(),
    slug: generateSlug(linkedInCompany.companyName),
    initials: generateInitials(linkedInCompany.companyName),
    description: linkedInCompany.description || linkedInCompany.headline || '',
    city: extractCity(linkedInCompany.headquarters || ''),
    sector: mapIndustryToSector(linkedInCompany.industry || '', defaultSector),
    size: normalizeCompanySize(linkedInCompany.companySize || ''),
    status: 'Aktif',
    website: linkedInCompany.website || '',
    linkedin_url: linkedInCompany.url,
    source: 'linkedin-apify',
    scraped_at: new Date().toISOString(),
  };
}

async function main() {
  log('🚀 LinkedIn Şirket Çekme Başlatılıyor...');
  log(`🎯 Hedef: ${CONFIG.totalTarget} şirket`);
  log(`⚙️  Batch boyutu: ${CONFIG.batchSize}, Bekleme: ${CONFIG.delayBetweenBatches}ms`);
  
  // Dizin oluştur
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Client'ları başlat
  const apifyClient = new ApifyClient({ token: APIFY_TOKEN });
  
  // Mevcut sonuçları yükle (varsa)
  let allResults: ScrapeResult[] = [];
  let allCompanies: FirmascopeCompany[] = [];
  
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
      allCompanies = existing.companies || [];
      log(`📂 Mevcut ${allCompanies.length} şirket yüklendi`);
    } catch {
      log('⚠️  Mevcut dosya okunamadı, sıfırdan başlanıyor', 'warning');
    }
  }
  
  // Slug'ları takip et (duplicate kontrolü)
  const existingSlugs = new Set(allCompanies.map(c => c.slug));
  
  // Arama stratejisini batch'lere böl
  const batches: any[] = [];
  for (let i = 0; i < SEARCH_STRATEGY.length; i += CONFIG.batchSize) {
    batches.push(SEARCH_STRATEGY.slice(i, i + CONFIG.batchSize));
  }
  
  log(`📦 Toplam ${batches.length} batch işlenecek`);
  
  // Batch'leri işle
  let batchIndex = 0;
  for (const batch of batches) {
    batchIndex++;
    
    // Hedefe ulaştık mı kontrol et
    if (allCompanies.length >= CONFIG.totalTarget) {
      log(`🎉 Hedefe ulaşıldı! (${allCompanies.length} şirket)`, 'success');
      break;
    }
    
    log(`\n📦 Batch ${batchIndex}/${batches.length} - Mevcut: ${allCompanies.length}/${CONFIG.totalTarget}`);
    
    // Bu batch'i işle
    for (const searchConfig of batch) {
      const result = await scrapeCompanies(apifyClient, searchConfig);
      allResults.push(result);
      
      if (result.companies.length > 0) {
        // Firmascope formatına çevir ve ekle
        const newCompanies = result.companies
          .map(c => convertToFirmascopeFormat(c, searchConfig.sector))
          .filter(c => !existingSlugs.has(c.slug)); // Duplicate'leri at
        
        for (const company of newCompanies) {
          allCompanies.push(company);
          existingSlugs.add(company.slug);
        }
        
        log(`➕ ${newCompanies.length} yeni şirket eklendi`, 'success');
      }
      
      // Ara ver
      if (batch.indexOf(searchConfig) < batch.length - 1) {
        log(`😴 3 saniye ara...`);
        await delay(3000);
      }
    }
    
    // Batch sonrası bekleme (son batch değilse)
    if (batchIndex < batches.length && allCompanies.length < CONFIG.totalTarget) {
      log(`😴 Batch sonrası ${CONFIG.delayBetweenBatches / 1000} saniye bekleniyor...`);
      await delay(CONFIG.delayBetweenBatches);
    }
    
    // Ara kaydet
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify({
      companies: allCompanies,
      results: allResults,
      metadata: {
        totalScraped: allCompanies.length,
        target: CONFIG.totalTarget,
        completedAt: new Date().toISOString(),
      }
    }, null, 2));
    
    log(`💾 Ara kayıt yapıldı: ${OUTPUT_FILE}`);
  }
  
  // Final sonuç
  log(`\n${'='.repeat(50)}`);
  log(`✅ TAMAMLANDI!`, 'success');
  log(`📊 Toplam ${allCompanies.length} şirket çekildi`);
  log(`📁 Sonuçlar: ${OUTPUT_FILE}`);
  log(`📝 Log: ${LOG_FILE}`);
  
  // Özet göster
  const sectorCounts: Record<string, number> = {};
  for (const company of allCompanies) {
    sectorCounts[company.sector || 'Diğer'] = (sectorCounts[company.sector || 'Diğer'] || 0) + 1;
  }
  
  log(`\n📈 Sektör Dağılımı:`);
  Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([sector, count]) => {
      log(`   ${sector}: ${count}`);
    });
  
  // İlk 10 şirketi göster
  log(`\n🏢 İlk 10 Şirket:`);
  allCompanies.slice(0, 10).forEach((c, i) => {
    log(`   ${i + 1}. ${c.name} (${c.sector}, ${c.city})`);
  });
}

// Hata yakalama
process.on('unhandledRejection', (error) => {
  log(`💥 Beklenmeyen hata: ${error}`, 'error');
  process.exit(1);
});

// Başlat
main().catch(error => {
  log(`💌 Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
