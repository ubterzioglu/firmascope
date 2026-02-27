# Türkiye Beyaz Yaka Şirketleri — Veri Toplama Stratejisi

> **Amaç:** Türkiye genelinde beyaz yaka çalışan barındıran 100+ şirketin temel bilgilerini toplamak
> 
> **Öncelik:** Şirket adı, sektör, şehir, çalışan sayısı, logo
> 
> **Yasal Uyarı:** Sadece kamuya açık bilgiler toplanmalı, özel veri/scrape yapılmamalı

---

## 📋 Strateji Özeti

### Toplam 4 Farklı Yaklaşım:
1. **Açık API Kullanımı** (Önerilen, yasal)
2. **Kamu Verileri / Resmi Listeler** (En güvenli)
3. **LinkedIn Sales Navigator** (Manuel, yasal)
4. **Otomasyon/Scraping** (Riskli, dikkatli kullanılmalı)

---

## 1️⃣ AÇIK API KULLANIMI (Önerilen)

### 1.1 LinkedIn API (OAuth gerektirir)
```javascript
// LinkedIn API - Şirket bilgileri
// NOT: LinkedIn API erişimi kısıtlıdır, partner programı gerekebilir

const getCompanyInfo = async (companyId) => {
  const response = await fetch(
    `https://api.linkedin.com/v2/companies/${companyId}`,
    {
      headers: {
        'Authorization': 'Bearer {ACCESS_TOKEN}',
        'X-Restli-Protocol-Version': '2.0.0'
      }
    }
  );
  return response.json();
};

// Dönen veriler:
// - localizedName
// - locations
// - staffCountRange
// - logoV2
// - description
// - industries
```

**Değerlendirme:**
- ✅ Yasal ve güvenilir
- ⚠️ API erişimi zor (LinkedIn Partner Programı)
- ⚠️ Rate limiting agresif
- 💡 Alternatif: RapidAPI üzerinden proxy servisler

---

### 1.2 Clearbit API (Logo ve temel bilgi)
```javascript
// Clearbit Logo API - Ücretsiz
const getCompanyLogo = async (domain) => {
  const response = await fetch(
    `https://logo.clearbit.com/${domain}?size=200`
  );
  return response.url;
};

// Clearbit Enrichment API (Ücretli)
const getCompanyData = async (domain) => {
  const response = await fetch(
    `https://company.clearbit.com/v2/companies/find?domain=${domain}`,
    {
      headers: {
        'Authorization': 'Bearer {API_KEY}'
      }
    }
  );
  return response.json();
};

// Dönen veriler:
// - name
// - domain
// - industry
// - employees (tahmini)
// - location
// - logo
// - description
```

**Değerlendirme:**
- ✅ Kolay kullanım
- ✅ Güzel logolar
- ⚠️ Türkiye şirketleri sınırlı
- 💵 Ücretli plan gerekli (aylık 50$+)

---

### 1.3 Glassdoor API (Partner erişimi)
```javascript
// Glassdoor API - Şirket bilgileri
// Partner erişimi gerektirir

const getGlassdoorCompany = async (companyName) => {
  const response = await fetch(
    `https://api.glassdoor.com/api/api.htm?t.p={PARTNER_ID}&t.k={KEY}&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q=${companyName}`
  );
  return response.json();
};
```

**Değerlendirme:**
- ✅ Zengin şirket verileri
- ⚠️ Partner başvurusu gerekli
- ⚠️ Türkiye kapsamı sınırlı

---

## 2️⃣ KAMU VERİLERİ / RESMİ LİSTELER (En Güvenli)

### 2.1 TOBB (Türkiye Odalar ve Borsalar Birliği)
**Kaynak:** https://www.tobb.org.tr/Sayfalar/EnBuyukSirketler.php

```python
# TOBB'un açıkladığı "Türkiye'nin En Büyük 500 Şirketi" listesi
# Manuel olarak indirilebilir veya açık veri varsa kullanılabilir

# 2023 Listesinden örnek şirketler:
TOP_500_TURKEY = [
    {"name": "TÜPRAŞ", "sector": "Petrol", "city": "Kocaeli", "revenue": "1.029.424"},
    {"name": "Türk Hava Yolları", "sector": "Havacılık", "city": "İstanbul", "revenue": "595.153"},
    {"name": "Petrol Ofisi", "sector": "Petrol", "city": "İstanbul", "revenue": "437.613"},
    {"name": "BİM Birleşik Mağazalar", "sector": "Perakende", "city": "İstanbul", "revenue": "80.000"},
    {"name": "Ford Otosan", "sector": "Otomotiv", "city": "Kocaeli", "revenue": "193.000"},
    {"name": "Oyak-Renault", "sector": "Otomotiv", "city": "Bursa", "revenue": "147.000"},
    {"name": "Tümosan", "sector": "Otomotiv", "city": "Konya", "revenue": "12.000"},
    {"name": "Arçelik", "sector": "Beyaz Eşya", "city": "İstanbul", "revenue": "60.000"},
    {"name": "Vestel", "sector": "Elektronik", "city": "Manisa", "revenue": "18.000"},
]
```

**Yaklaşım:**
1. TOBB'un yıllık raporlarını indir (PDF)
2. Tablo verilerini OCR veya manuel çıkar
3. Şirket isimlerini firmascope formatına dönüştür

---

### 2.2 Fortune 500 Türkiye
**Kaynak:** https://fortuneturkey.com/fortune-500-turkiye

```python
# Fortune 500 Türkiye listesi
# Web sitesinden manuel veya izinli şekilde veri çekilebilir

FORTUNE_500_TURKEY = [
    {"rank": 1, "name": "TÜPRAŞ", "sector": "Enerji", "city": "İzmit"},
    {"rank": 2, "name": "Türk Hava Yolları", "sector": "Havacılık", "city": "İstanbul"},
    {"rank": 3, "name": "Petrol Ofisi", "sector": "Enerji", "city": "İstanbul"},
    {"rank": 4, "name": "OPET", "sector": "Enerji", "city": "İstanbul"},
    {"rank": 5, "name": "Aygaz", "sector": "Enerji", "city": "İstanbul"},
    # ... devamı
]
```

---

### 2.3 İSO (İstanbul Sanayi Odası) - İlk 500
**Kaynak:** https://www.iso.org.tr/icerik/2514/iso-500-2023

```python
# İSO İlk 500 Büyük Sanayi Kuruluşu
# İstanbul merkezli büyük sanayi şirketleri

ISO_TOP_500 = [
    {"name": "TÜPRAŞ", "sector": "Petrol Rafinerisi", "city": "İzmit"},
    {"name": "Ford Otosan", "sector": "Otomotiv", "city": "Gölcük"},
    {"name": "Toyota", "sector": "Otomotiv", "city": "Sakarya"},
    {"name": "Honda", "sector": "Otomotiv", "city": "Kocaeli"},
    {"name": "Hyundai Assan", "sector": "Otomotiv", "city": "Kocaeli"},
]
```

---

### 2.4 KOSGEB ve Teknopark Şirketleri
```python
# Teknoparklarda yer alan teknoloji şirketleri
# Kamu verisi olarak erişilebilir

TECH_PARK_COMPANIES = [
    {"name": "Getir", "sector": "Teknoloji", "city": "İstanbul", "park": "İTÜ Teknopark"},
    {"name": "Trendyol", "sector": "E-Ticaret", "city": "İstanbul", "park": "METU Teknopark"},
    {"name": "Hepsiburada", "sector": "E-Ticaret", "city": "İstanbul", "park": "İTÜ Teknopark"},
    {"name": "Peak Games", "sector": "Oyun", "city": "İstanbul", "park": "İTÜ Teknopark"},
    {"name": "Dream Games", "sector": "Oyun", "city": "İstanbul", "park": "Kozyatağı"},
]
```

---

### 2.5 Borsa İstanbul (BİST) Şirketleri
**Kaynak:** https://www.borsaistanbul.com/

```python
# BİST'e kote şirketler - Açık veri
# Tüm kamu şirketleri burada listeli

BIST_COMPANIES = [
    {"code": "THYAO", "name": "Türk Hava Yolları", "sector": "Havacılık"},
    {"code": "GARAN", "name": "Garanti BBVA", "sector": "Bankacılık"},
    {"code": "ISCTR", "name": "İş Bankası", "sector": "Bankacılık"},
    {"code": "AKBNK", "name": "Akbank", "sector": "Bankacılık"},
    {"code": "YKBNK", "name": "Yapı Kredi", "sector": "Bankacılık"},
    {"code": "KCHOL", "name": "Koç Holding", "sector": "Holding"},
    {"code": "SAHOL", "name": "Sabancı Holding", "sector": "Holding"},
    {"code": "ARCLK", "name": "Arçelik", "sector": "Beyaz Eşya"},
    {"code": "VESTL", "name": "Vestel", "sector": "Elektronik"},
    {"code": "BIMAS", "name": "BİM", "sector": "Perakende"},
    {"code": "TUPRS", "name": "TÜPRAŞ", "sector": "Enerji"},
    {"code": "EREGL", "name": "Ereğli Demir Çelik", "sector": "Demir Çelik"},
]
```

---

## 3️⃣ MANUEL TOPLAMA / CROWDSOURCING

### 3.1 LinkedIn Manuel Araştırma
```
Adım adım yaklaşım:

1. LinkedIn'de şirket araması yap
2. "Şirketler" sekmesine git
3. Filtrele: Türkiye, 1000+ çalışan
4. Listeyi kaydet (manuel kopyalama)
5. Her şirket için:
   - LinkedIn sayfası URL'si
   - Websitesi
   - Çalışan sayısı aralığı
   - Merkez şehri
   - Sektör
```

**Zaman tahmini:**
- 100 şirket = ~8-10 saat
- Günlük 20 şirket = 5 gün

---

### 3.2 Crowdsourcing (Topluluk Katkısı)
```typescript
// Firmascope'a "Şirket Ekle" özelliği genişletilebilir
// Kullanıcılar şirket önerisinde bulunur

interface CompanySuggestion {
  company_name: string;
  website: string;
  sector: string;
  city: string;
  employee_count?: string;
  suggester_email: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

**Strateji:**
1. Mevcut şirket öneri formunu geliştir
2. LinkedIn/website zorunlu alan ekle
3. Kullanıcıları teşvik et (rozet, puan sistemi)
4. Admin onay akışı otomatikleştir

---

### 3.3 Sektör Dernekleri ve Oda Listeleri
```python
# Sektör odalarının üye listeleri (kamuya açık kısımlar)

SECTOR_ASSOCIATIONS = {
    "Yazılım": [
        "Turkish Software Association (YASAD)",
        "Bilişim Sanayicileri Derneği (TÜBİSAD)",
    ],
    "Finans": [
        "Türkiye Bankalar Birliği",
        "Türkiye Sermaye Piyasaları Birliği",
    ],
    "Perakende": [
        "Perakende Günleri Derneği",
        "Türkiye Perakendeciler Federasyonu",
    ],
    "Otomotiv": [
        "Otomotiv Sanayii Derneği (OSD)",
        "TAYSAD",
    ],
    "İnşaat": [
        "Türkiye Müteahhitler Birliği",
        "İstanbul İnşaatçılar Derneği",
    ]
}
```

---

## 4️⃣ TEKNİK OTOMATİSYON (Dikkatli Kullanılmalı)

### ⚠️ Yasal Uyarı
> Bu bölümdeki yöntemler sadece **robots.txt izin veriyorsa** ve **aşırı yük oluşturmadan** kullanılmalıdır. Aksi halde yasal sorunlar doğabilir.

### 4.1 LinkedIn Public Company Pages (Robots.txt kontrolü şart)
```python
# Selenium ile LinkedIn public şirket sayfaları
# NOT: LinkedIn scraping yasakları sıkıdır!

from selenium import webdriver
from selenium.webdriver.common.by import By
import time

def get_linkedin_company_info(company_slug):
    """
    LinkedIn public company sayfasından bilgi çekme
    SADECE robots.txt izin verirse kullan!
    """
    url = f"https://www.linkedin.com/company/{company_slug}/"
    
    driver = webdriver.Chrome()
    driver.get(url)
    time.sleep(3)  # JS render için bekle
    
    try:
        name = driver.find_element(By.CSS_SELECTOR, "h1").text
        followers = driver.find_element(By.CSS_SELECTOR, "[data-test-id='about-us__size']").text
        
        return {
            "name": name,
            "followers": followers,
        }
    except:
        return None
    finally:
        driver.quit()
```

**Risk:** 🔴 Yüksek - LinkedIn scraping'i engeller, ban atar

---

### 4.2 Google Places API (Yasal, güvenli)
```javascript
// Google Places API - Şirket arama
// Her ay 200$ ücretsiz kredi

const searchCompanies = async (query, location) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?` +
    `query=${query}+in+${location}&` +
    `key=${GOOGLE_API_KEY}`
  );
  
  const data = await response.json();
  
  return data.results.map(place => ({
    name: place.name,
    address: place.formatted_address,
    location: place.geometry.location,
    place_id: place.place_id,
    rating: place.rating,
    user_ratings_total: place.user_ratings_total,
    types: place.types,
  }));
};

// Detay çekme
const getCompanyDetails = async (placeId) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?` +
    `place_id=${placeId}&` +
    `fields=name,formatted_address,formatted_phone_number,website,opening_hours,photos&` +
    `key=${GOOGLE_API_KEY}`
  );
  
  return response.json();
};
```

**Değerlendirme:**
- ✅ Yasal ve güvenilir
- ✅ Türkiye verileri güçlü
- ⚠️ Ücretli (200$ sonrası)
- 💡 "Büyük şirketler İstanbul" şeklinde arama yapılabilir

---

### 4.3 Web Scraping (Sadece izin verilen sitelerden)
```python
# Örnek: Glassdoor scraping (robots.txt kontrolü şart!)
# NOT: Sadece eğitim amaçlı, yasal risk var

import requests
from bs4 import BeautifulSoup
import time

def scrape_glassdoor_companies(country="Turkey", page=1):
    """
    Glassdoor şirket listesi - robots.txt izin verirse
    """
    url = f"https://www.glassdoor.com/Explore/browse-companies.htm?overall_rating_low=3&page={page}&loc={country}"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    companies = []
    
    for company in soup.select('.company-tile'):
        try:
            name = company.select_one('.company-name').text.strip()
            rating = company.select_one('.rating').text.strip()
            
            companies.append({
                'name': name,
                'rating': rating,
            })
        except:
            continue
    
    return companies

# Rate limiting - Çok önemli!
time.sleep(2)  # Her istek arası bekleme
```

**Risk:** 🟡 Orta - Glassdoor scraping'i hoş karşılamaz

---

## 📊 HAZIR ŞİRKET LİSTESİ (İlk 50)

Aşağıdaki listeyi hemen kullanabilirsiniz:

```javascript
const TURKEY_TOP_50_WHITE_COLLAR = [
  // Bankacılık & Finans
  { name: "Garanti BBVA", sector: "Bankacılık", city: "İstanbul", size: "18.000+" },
  { name: "İş Bankası", sector: "Bankacılık", city: "İstanbul", size: "24.000+" },
  { name: "Akbank", sector: "Bankacılık", city: "İstanbul", size: "13.000+" },
  { name: "Yapı Kredi", sector: "Bankacılık", city: "İstanbul", size: "17.000+" },
  { name: "Halkbank", sector: "Bankacılık", city: "İstanbul", size: "19.000+" },
  { name: "Ziraat Bankası", sector: "Bankacılık", city: "Ankara", size: "24.000+" },
  { name: "QNB Finansbank", sector: "Bankacılık", city: "İstanbul", size: "12.000+" },
  { name: "DenizBank", sector: "Bankacılık", city: "İstanbul", size: "14.000+" },
  
  // Teknoloji & İletişim
  { name: "Türk Telekom", sector: "Telekomünikasyon", city: "Ankara", size: "35.000+" },
  { name: "Turkcell", sector: "Telekomünikasyon", city: "İstanbul", size: "20.000+" },
  { name: "Vodafone Türkiye", sector: "Telekomünikasyon", city: "İstanbul", size: "3.000+" },
  { name: "Trendyol", sector: "E-Ticaret", city: "İstanbul", size: "10.000+" },
  { name: "Hepsiburada", sector: "E-Ticaret", city: "İstanbul", size: "8.000+" },
  { name: "Getir", sector: "Teknoloji", city: "İstanbul", size: "30.000+" },
  { name: "TurkNet", sector: "Telekomünikasyon", city: "İstanbul", size: "2.000+" },
  
  // Havacılık & Ulaşım
  { name: "Türk Hava Yolları", sector: "Havacılık", city: "İstanbul", size: "40.000+" },
  { name: "Pegasus", sector: "Havacılık", city: "İstanbul", size: "12.000+" },
  { name: "AnadoluJet", sector: "Havacılık", city: "Ankara", size: "5.000+" },
  
  // Otomotiv
  { name: "Ford Otosan", sector: "Otomotiv", city: "Kocaeli", size: "12.000+" },
  { name: "Oyak-Renault", sector: "Otomotiv", city: "Bursa", size: "7.000+" },
  { name: "Toyota", sector: "Otomotiv", city: "Sakarya", size: "4.000+" },
  { name: "Mercedes-Benz Türk", sector: "Otomotiv", city: "İstanbul", size: "5.000+" },
  { name: "Tofaş", sector: "Otomotiv", city: "Bursa", size: "6.000+" },
  { name: "Hyundai Assan", sector: "Otomotiv", city: "Kocaeli", size: "3.000+" },
  
  // Perakende
  { name: "BİM", sector: "Perakende", city: "İstanbul", size: "70.000+" },
  { name: "A101", sector: "Perakende", city: "İstanbul", size: "60.000+" },
  { name: "Şok Marketler", sector: "Perakende", city: "İstanbul", size: "40.000+" },
  { name: "Migros", sector: "Perakende", city: "İstanbul", size: "30.000+" },
  { name: "CarrefourSA", sector: "Perakende", city: "İstanbul", size: "15.000+" },
  
  // Enerji
  { name: "TÜPRAŞ", sector: "Enerji", city: "Kocaeli", size: "6.000+" },
  { name: "Petrol Ofisi", sector: "Enerji", city: "İstanbul", size: "5.000+" },
  { name: "Aygaz", sector: "Enerji", city: "İstanbul", size: "3.000+" },
  { name: "OPET", sector: "Enerji", city: "İstanbul", size: "4.000+" },
  { name: "Enerjisa", sector: "Enerji", city: "İstanbul", size: "5.000+" },
  
  // Üretim & Sanayi
  { name: "Arçelik", sector: "Beyaz Eşya", city: "İstanbul", size: "40.000+" },
  { name: "Vestel", sector: "Elektronik", city: "Manisa", size: "18.000+" },
  { name: "Ereğli Demir Çelik", sector: "Demir Çelik", city: "Zonguldak", size: "12.000+" },
  { name: "İskenderun Demir Çelik", sector: "Demir Çelik", city: "Hatay", size: "5.000+" },
  { name: "Coca-Cola İçecek", sector: "Gıda", city: "İstanbul", size: "10.000+" },
  { name: "Ülker", sector: "Gıda", city: "İstanbul", size: "12.000+" },
  { name: "Anadolu Efes", sector: "İçecek", city: "İstanbul", size: "8.000+" },
  
  // İlaç & Sağlık
  { name: "Abdi İbrahim", sector: "İlaç", city: "İstanbul", size: "4.000+" },
  { name: "Bilim İlaç", sector: "İlaç", city: "İstanbul", size: "2.500+" },
  { name: "Acıbadem Sağlık Grubu", sector: "Sağlık", city: "İstanbul", size: "20.000+" },
  { name: "Medicana", sector: "Sağlık", city: "İstanbul", size: "10.000+" },
  
  // Holding & Diğer
  { name: "Koç Holding", sector: "Holding", city: "İstanbul", size: "100.000+" },
  { name: "Sabancı Holding", sector: "Holding", city: "İstanbul", size: "60.000+" },
  { name: "Doğuş Grubu", sector: "Holding", city: "İstanbul", size: "15.000+" },
  { name: "Yıldız Holding", sector: "Holding", city: "İstanbul", size: "50.000+" },
];
```

---

## 🛠️ TOPLU EKLEME ARACI

### Admin Script
```typescript
// Supabase'e toplu şirket ekleme script'i

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const bulkInsertCompanies = async (companies: any[]) => {
  const companiesWithSlug = companies.map(company => ({
    ...company,
    slug: generateSlug(company.name),
    initials: generateInitials(company.name),
    status: 'Aktif',
  }));
  
  const { data, error } = await supabase
    .from('companies')
    .upsert(companiesWithSlug, { 
      onConflict: 'slug',
      ignoreDuplicates: true 
    });
  
  if (error) {
    console.error('Bulk insert error:', error);
    return;
  }
  
  console.log(`Inserted ${data?.length} companies`);
};

// Kullanım
bulkInsertCompanies(TURKEY_TOP_50_WHITE_COLLAR);
```

---

## 📋 ÖNERİLEN YOL HARİTASI

### Hafta 1: Hazır Liste ile Başla
- [x] Yukarıdaki 50 şirketi Supabase'e ekle
- [ ] Logoları Clearbit/LinkedIn'den topla
- [ ] Şirket sayfalarını kontrol et

### Hafta 2: Topluluk Katkısı
- [ ] Şirket öneri formunu geliştir
- [ ] LinkedIn zorunlu alan ekle
- [ ] Kullanıcıları teşvik et (email, sosyal medya)
- [ ] Gelen önerileri onayla

### Hafta 3: API Entegrasyonu
- [ ] Clearbit API deneme
- [ ] Google Places API entegrasyonu
- [ ] Otomatik logo/bilgi çekme

### Hafta 4: Kalite Kontrol
- [ ] Eksik bilgileri tamamla
- [ ] Yanlış/eskimiş verileri güncelle
- [ ] 100 şirket hedefine ulaş

---

## ⚖️ Yasal ve Etik Hususlar

### ✅ Yapılabilir:
- Kamuya açık listeleri kullanma (TOBB, Fortune, BİST)
- API ile yasal veri çekme (Google Places, Clearbit)
- Kullanıcı gönüllü girişleri
- Şirketlerin kendi paylaştığı bilgiler

### ❌ Yapılmamalı:
- LinkedIn scraping (yasak)
- Glassdoor scraping (yasak)
- Özel veritabanlarından izinsiz çekme
- Şirket içi gizli bilgiler
- Çalışan kişisel bilgileri

### 🟡 Dikkatli Kullanılmalı:
- Web scraping (robots.txt kontrolü şart)
- Rate limiting (sunuculara zarar vermemek)
- Telif hakkı olan içerikler

---

## 🎯 Sonuç

**En Hızlı Yol:**
1. Hazır listeyi (50 şirket) hemen ekle
2. Kullanıcı öneri sistemini aktifleştir
3. Clearbit ile logo/bilgi tamamla
4. Topluluk katkısıyla 100+ şirkete ulaş

**Orta Vadeli:**
- Google Places API entegrasyonu
- Sektör odaları ile iletişim
- Şirketlerin kendi veri girişini teşvik

---

*Bu doküman yasal veri toplama yöntemlerini içerir. Herhangi bir scraping işleminden önce hukuki danışma alınması önerilir.*
