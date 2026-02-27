# Apify LinkedIn Scraper API Kullanım Kılavuzu

> **Actor:** `linkedin-premium-actor` (bebity)  
> **Actor ID:** `od6RadQV98FOARtrp`  
> **Fiyat:** $29/ay (flat rate)  
> **Kullanım Limiti:** 150,000 işlem/ay  
> **Derecelendirme:** 4.13/5 (39 yorum, 2.9M+ çalıştırma)

---

## 📊 Mevcut Run Analizi

Son çalıştırılan run (`I0uapGZLXDosmZMBJ`):
- **Durum:** ✅ SUCCEEDED (Başarılı)
- **Süre:** 7.1 saniye
- **Sonuç:** 1 LinkedIn profili çekildi
- **Arama:** "web dev" anahtar kelimesi
- **Maliyet:** $0.0025

### Çekilen Veri Örneği:
```json
{
  "url": "https://linkedin.com/in/syed-268937164",
  "firstName": "Syed Aitzaz",
  "lastName": "Anwar",
  "headline": "Web Dev | SEO | Digital Marketing",
  "EXPERIENCE": [
    {
      "title": "Web Developer",
      "subtitle": "Self-employed",
      "caption": "Oct 2023 - Present · 2 yrs 5 mos",
      "meta": "Hybrid"
    },
    {
      "title": "Accounts Payable Assistant",
      "subtitle": "Orbit Cargo Services LTD · Part-time",
      "caption": "Oct 2019 - Jul 2024 · 4 yrs 10 mos",
      "meta": "Slough, England, United Kingdom"
    }
  ],
  "EDUCATION": [...],
  "LICENSES_AND_CERTIFICATIONS": [...]
}
```

---

## 🚀 API Kullanımı

### 1. Actor'ü Çalıştırma (Yeni Run Başlatma)

**Endpoint:**
```http
POST https://api.apify.com/v2/acts/od6RadQV98FOARtrp/runs?token=YOUR_APIFY_TOKEN
```

**Headers:**
```http
Content-Type: application/json
```

**Request Body (Örnekler):**

#### A) Şirket Arama (Firmascope için önerilen)
```json
{
  "keywords": ["software company"],
  "location": "Turkey",
  "action": "get-companies",
  "limit": 50
}
```

#### B) Profil Arama
```json
{
  "keywords": ["CEO", "CTO"],
  "location": "Istanbul, Turkey",
  "action": "get-profiles",
  "limit": 100
}
```

#### C) Belirli URL'den Çekme
```json
{
  "urls": [
    "https://www.linkedin.com/company/trendyol",
    "https://www.linkedin.com/company/getir"
  ],
  "action": "get-companies",
  "limit": 10
}
```

---

## 📥 Input Parametreleri

| Parametre | Tip | Açıklama | Örnek |
|-----------|-----|----------|-------|
| `action` | string | İşlem tipi | `"get-companies"` veya `"get-profiles"` |
| `keywords` | array | Arama kelimeleri | `["yazılım", "teknoloji"]` |
| `urls` | array | Doğrudan URL'ler | `["https://linkedin.com/company/x"]` |
| `location` | string | Konum filtresi | `"Turkey"`, `"Istanbul"` |
| `limit` | number | Max sonuç sayısı | `50` (varsayılan), max `1000` |
| `filters` | object | Ek filtreler | `{"companySize": "51-200"}` |

### Sektörlere Göre Arama Örnekleri:

```javascript
// Teknoloji şirketleri
const techCompanies = {
  keywords: ["software", "technology", "saas"],
  location: "Turkey",
  action: "get-companies",
  limit: 100
};

// Bankacılık
const banks = {
  keywords: ["bank", "finance", "fintech"],
  location: "Istanbul, Turkey",
  action: "get-companies",
  limit: 50
};

// Perakende
const retail = {
  keywords: ["retail", "e-commerce", "shopping"],
  location: "Turkey",
  action: "get-companies",
  limit: 50
};

// Otomotiv
const automotive = {
  keywords: ["automotive", "car", "vehicle"],
  location: "Turkey",
  action: "get-companies",
  limit: 50
};
```

---

## 📤 Output Yapısı (Şirket Verisi)

```json
{
  "url": "https://linkedin.com/company/trendyol",
  "companyName": "Trendyol",
  "headline": "Tech company - e-commerce",
  "description": "Turkey's leading e-commerce platform...",
  "industry": "Internet",
  "companySize": "10001+ employees",
  "headquarters": "Istanbul, Turkey",
  "founded": "2010",
  "specialties": ["E-commerce", "Technology", "Logistics"],
  "website": "https://www.trendyol.com",
  "followers": "500000+",
  "employeesOnLinkedIn": "10000+",
  "affiliatedCompanies": [...],
  "locations": [
    {
      "address": "Istanbul, Turkey",
      "type": "Headquarters"
    }
  ],
  "updates": [...]
}
```

---

## 💻 Node.js / TypeScript Implementation

### Kurulum
```bash
npm install apify-client
```

### FirmaScope Entegrasyon Script'i
```typescript
import { ApifyClient } from 'apify-client';
import { createClient } from '@supabase/supabase-js';

// Apify client
const apifyClient = new ApifyClient({
  token: 'YOUR_APIFY_TOKEN',
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface LinkedInCompany {
  url: string;
  companyName: string;
  headline?: string;
  description?: string;
  industry?: string;
  companySize?: string;
  headquarters?: string;
  website?: string;
  followers?: string;
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
}

/**
 * LinkedIn'den şirket verisi çek ve firmascope'a ekle
 */
async function scrapeLinkedInCompanies(
  keywords: string[],
  location: string = 'Turkey',
  limit: number = 50
): Promise<void> {
  console.log(`🔍 LinkedIn'den aranıyor: ${keywords.join(', ')}`);

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

    console.log(`⏳ Run başlatıldı: ${run.id}`);
    console.log(`🌐 Konsol: https://console.apify.com/view/runs/${run.id}`);

    // Run'ın tamamlanmasını bekle (polling)
    let runStatus = await apifyClient.run(run.id).get();
    
    while (runStatus?.status !== 'SUCCEEDED' && runStatus?.status !== 'FAILED') {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 saniye bekle
      runStatus = await apifyClient.run(run.id).get();
      console.log(`⏳ Durum: ${runStatus?.status}`);
    }

    if (runStatus.status === 'FAILED') {
      throw new Error('Run başarısız oldu');
    }

    // Sonuçları çek
    const { items } = await apifyClient
      .dataset(run.defaultDatasetId)
      .listItems();

    console.log(`✅ ${items.length} şirket bulundu`);

    // Firmascope formatına dönüştür
    const companies: FirmascopeCompany[] = items.map((item: any) => ({
      name: item.companyName,
      slug: generateSlug(item.companyName),
      initials: generateInitials(item.companyName),
      description: item.description?.substring(0, 500) || item.headline,
      city: extractCity(item.headquarters),
      sector: mapIndustryToSector(item.industry),
      size: normalizeCompanySize(item.companySize),
      status: 'Aktif',
    }));

    // Supabase'e kaydet
    const { data, error } = await supabase
      .from('companies')
      .upsert(companies, { 
        onConflict: 'slug',
        ignoreDuplicates: true 
      });

    if (error) {
      console.error('❌ Supabase hatası:', error);
      return;
    }

    console.log(`✅ ${data?.length} şirket eklendi`);

    // Logoları ayrıca indir (opsiyonel)
    for (const company of items) {
      if (company.companyName) {
        await fetchLogo(company.companyName);
      }
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

// Yardımcı fonksiyonlar
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase())
    .join('');
}

function extractCity(headquarters: string): string {
  if (!headquarters) return 'İstanbul'; // Default
  
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya'];
  const found = cities.find(city => 
    headquarters.toLowerCase().includes(city.toLowerCase())
  );
  return found || 'İstanbul';
}

function mapIndustryToSector(industry: string): string {
  const mapping: Record<string, string> = {
    'Information Technology': 'Teknoloji',
    'Software Development': 'Teknoloji',
    'Computer Software': 'Teknoloji',
    'Financial Services': 'Finans',
    'Banking': 'Finans',
    'Retail': 'Perakende',
    'E-commerce': 'Perakende',
    'Automotive': 'Otomotiv',
    'Airlines/Aviation': 'Havacılık',
    'Telecommunications': 'Telekomünikasyon',
    'Health Care': 'Sağlık',
    'Pharmaceuticals': 'İlaç',
    'Food & Beverages': 'Gıda',
  };
  
  return mapping[industry] || 'Diğer';
}

function normalizeCompanySize(size: string): string {
  if (!size) return '51-200';
  
  if (size.includes('10001')) return '10000+';
  if (size.includes('5001')) return '5001-10000';
  if (size.includes('1001')) return '1001-5000';
  if (size.includes('501')) return '501-1000';
  if (size.includes('201')) return '201-500';
  if (size.includes('51')) return '51-200';
  if (size.includes('11')) return '11-50';
  if (size.includes('1-10')) return '1-10';
  
  return '51-200';
}

async function fetchLogo(companyName: string): Promise<string | null> {
  try {
    const response = await fetch(`https://logo.clearbit.com/${generateDomain(companyName)}`);
    if (response.ok) {
      return response.url;
    }
  } catch {
    // Logo bulunamadı, önemli değil
  }
  return null;
}

function generateDomain(name: string): string {
  // Basit domain tahmini
  return `${generateSlug(name)}.com`;
}

// Kullanım örnekleri
async function main() {
  // 1. Teknoloji şirketleri
  await scrapeLinkedInCompanies(
    ['software', 'technology', 'saas'],
    'Turkey',
    50
  );

  // 2. Finans şirketleri
  await scrapeLinkedInCompanies(
    ['bank', 'finance', 'fintech'],
    'Istanbul, Turkey',
    30
  );

  // 3. Perakende
  await scrapeLinkedInCompanies(
    ['retail', 'e-commerce'],
    'Turkey',
    30
  );
}

main();
```

---

## 🔄 API Endpoint Referansı

### Run Yönetimi

| İşlem | Method | Endpoint |
|-------|--------|----------|
| **Yeni Run Başlat** | POST | `/v2/acts/od6RadQV98FOARtrp/runs` |
| **Run Detayı** | GET | `/v2/actor-runs/{runId}` |
| **Run'ı Yeniden Başlat** | POST | `/v2/actor-runs/{runId}/resurrect` |
| **Run'ı Durdur** | POST | `/v2/actor-runs/{runId}/abort` |

### Veri Erişimi

| İşlem | Method | Endpoint |
|-------|--------|----------|
| **Dataset Items** | GET | `/v2/datasets/{datasetId}/items` |
| **Input Config** | GET | `/v2/key-value-stores/{storeId}/records/INPUT` |
| **Logs** | GET | `/v2/logs/{runId}` |

### Senin Token'ınla Çalışan Örnekler:

```bash
# 1. Yeni run başlat (şirket arama)
curl -X POST \
  "https://api.apify.com/v2/acts/od6RadQV98FOARtrp/runs?token=YOUR_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": ["technology"],
    "location": "Turkey",
    "action": "get-companies",
    "limit": 50
  }'

# 2. Mevcut run'ın sonuçlarını çek
# Dataset ID: MAGhRHctJ6OhmAa2p
curl "https://api.apify.com/v2/datasets/MAGhRHctJ6OhmAa2p/items?token=YOUR_APIFY_TOKEN"

# 3. Logları görüntüle
curl "https://api.apify.com/v2/logs/I0uapGZLXDosmZMBJ?token=YOUR_APIFY_TOKEN"
```

---

## 💰 Maliyet Analizi

### Fiyatlandırma
- **Aylık Ücret:** $29 (flat rate)
- **Limit:** 150,000 işlem/ay
- **Birim Maliyet:** ~$0.00019/işlem

### Örnek Maliyetler:
| Senaryo | İşlem | Maliyet |
|---------|-------|---------|
| 100 şirket çekme | ~100 | $0.019 |
| 500 şirket çekme | ~500 | $0.095 |
| 1000 şirket çekme | ~1000 | $0.19 |
| Günlük 50 şirket (30 gün) | 1500 | $0.285 |

### Ücretsiz Deneme:
- **2880 dakika** (48 saat) ücretsiz deneme
- Kredi kartı gerektirir
- İstediğin zaman iptal edilebilir

---

## ⚠️ Önemli Notlar ve Sınırlamalar

### 1. Rate Limiting
```
- Aylık limit: 150,000 işlem
- Dakikada max: ~100 istek (tahmini)
- Bekleme süresi: Run başına 5-30 saniye
```

### 2. Veri Kalitesi
- ✅ Şirket adı, sektör, lokasyon genelde doğru
- ⚠️ Çalışan sayısı LinkedIn tahmini (kesin değil)
- ⚠️ Açıklamalar kısa olabilir
- ❌ Logo URL'i dönmeyebilir (Clearbit kullan)

### 3. Yasal Uyarılar
```
⚠️ LinkedIn scraping yasal gri alandadır
⚠️ Sadece kamuya açık verileri çek
⚠️ Kişisel veri (email, telefon) çekme
⚠️ Çok agresif scraping ban yemenize neden olabilir
⚠️ Verileri GDPR/KVKK uyumlu kullan
```

### 4. Best Practices
```typescript
// 1. Küçük batch'ler halinde çek
await scrapeLinkedInCompanies(['software'], 'Turkey', 20);
await delay(5000); // 5 saniye bekle
await scrapeLinkedInCompanies(['finance'], 'Turkey', 20);

// 2. Duplicate kontrolü yap
const existingSlugs = await getExistingCompanySlugs();
const newCompanies = results.filter(c => !existingSlugs.includes(c.slug));

// 3. Hata toleransı
for (const keyword of keywords) {
  try {
    await scrapeLinkedInCompanies([keyword], 'Turkey', 10);
  } catch (error) {
    console.error(`${keyword} hatası:`, error);
    // Devam et, diğer keyword'leri dene
  }
}
```

---

## 🎯 FirmaScope için Önerilen Strateji

### Faz 1: Hızlı Başlangıç (1. Hafta)
```typescript
// Sektör bazlı 100 şirket hedefi
const sectors = [
  { keywords: ['software', 'technology'], target: 30 },
  { keywords: ['bank', 'finance'], target: 20 },
  { keywords: ['retail', 'e-commerce'], target: 20 },
  { keywords: ['automotive'], target: 15 },
  { keywords: ['telecommunications'], target: 15 },
];

for (const sector of sectors) {
  await scrapeLinkedInCompanies(
    sector.keywords,
    'Turkey',
    sector.target
  );
}
```

### Faz 2: Zenginleştirme (2. Hafta)
```typescript
// Eksik bilgileri tamamla
// - Logo: Clearbit API
// - Detay: Şirket web sitesi scraping (etik)
// - Sosyal medya: Twitter, Instagram
```

### Faz 3: Otomasyon (3. Hafta)
```typescript
// Haftalık otomatik güncelleme
// - Yeni şirketleri tespit et
// - Bilgileri güncelle (çalışan sayısı vb.)
// - Pasif şirketleri işaretle
```

---

## 📋 Özet ve Sonuç

### ✅ Ne Yapabilirsin:
1. **Hedefe yönelik arama:** Sektör, konum, büyüklük filtresi
2. **Toplu veri çekme:** 1000+ şirket/ay
3. **Düzenli güncelleme:** Haftalık otomatik sync
4. **Maliyet etkin:** $29/ay ile 150K işlem

### ❌ Sınırlamalar:
1. **Türkçe desteği:** İngilizce keyword'ler daha iyi çalışır
2. **Veri derinliği:** LinkedIn'deki kadar detaylı
3. **Güncellik:** Gerçek zamanlı değil
4. **Yasal risk:** LinkedIn scraping yasakları

### 🚀 Hemen Başla:
```bash
# 1. Deneme başlat (ücretsiz)
curl -X POST \
  "https://api.apify.com/v2/acts/od6RadQV98FOARtrp/runs?token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"keywords":["software"],"location":"Turkey","action":"get-companies","limit":10}'

# 2. Sonuçları bekle ve kontrol et
# https://console.apify.com/view/runs/{runId}

# 3. Sonuçları çek
# Dataset items endpoint kullan
```

---

**Not:** Token'ın (`YOUR_APIFY_TOKEN`) güvenliği için:
- `.env` dosyasında sakla
- GitHub'a commit etme
- Paylaşırken dikkatli ol
