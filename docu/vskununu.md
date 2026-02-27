# firmascope vs Kununu — Karşılaştırma ve Eksikler Analizi

> **Kununu**: Almanya merkezli, Avrupa'nın en büyük işveren değerlendirme platformu (2007'den beri). 10+ milyon yorum, 18 kategoride detaylı değerlendirme.
> 
> **Firmascope**: Türkiye odaklı, yeni başlayan platform. Temel özellikler mevcut ama derinlemesine analiz eksik.

---

## 📊 Genel Karşılaştırma

| Özellik | Kununu | Firmascope | Durum |
|---------|--------|------------|-------|
| **Coğrafya** | Almanya, Avusturya, İsviçre (DACH) | Türkiye | ✅ Farklı pazar |
| **Yıllık Deneyim** | 17+ yıl | < 1 yıl | - |
| **Toplam Yorum** | 10+ milyon | < 100 | - |
| **Şirket Sayısı** | 1+ milyon | 2+ | - |
| **Kullanıcı** | 25+ milyon/yıl | - | - |
| **Değerlendirme Kategorisi** | 18 detaylı boyut | 1 genel puan | 🟡 Geliştirilmeli |
| **Ücret/Maaş Verisi** | ✅ Detaylı | ✅ Temel | ✅ Benzer |
| **Mülakat Deneyimleri** | ✅ Var | ✅ Var | ✅ Benzer |
| **Mobil Uygulama** | ✅ iOS/Android | ❌ Yok | 🔴 Eksik |
| **Şirket Yanıtları** | ✅ Var | ❌ Yok | 🔴 Eksik |
| **Doğrulanmış İncelemeler** | ✅ Var | ❌ Yok | 🟡 Planlanmalı |
| **Arama Motoru** | ✅ Güçlü | 🟡 Temel | 🟡 Geliştirilmeli |
| **SEO Optimizasyonu** | ✅ Mükemmel | ❌ Yok | 🔴 Kritik |

---

## 🎯 Kununu'nun 18 Değerlendirme Boyutu

Kununu her şirketi 18 farklı kategoride 1-5 yıldız ile değerlendirir. **Firmascope şu an sadece tek bir genel puan kullanıyor.**

### Kununu'nun 18 Kategorisi:

| # | Boyut | Açıklama | Firmascope'da? |
|---|-------|----------|----------------|
| 1 | **Atmosfer** (Work Atmosphere) | Genel çalışma ortamı, hava | 🟡 Kısmen (yorumlar) |
| 2 | **Kommunikation** (Communication) | İç iletişim, şeffaflık | ❌ Yok |
| 3 | **Work-Life Balance** | İş-yaşam dengesi, esneklik | ❌ Yok |
| 4 | **Arbeitsplatz** (Workplace) | Fiziksel çalışma ortamı, ergonomi | ❌ Yok |
| 5 | **Karriere** (Career) | Kariyer gelişimi, terfi fırsatları | 🟡 Kısmen |
| 6 | **Gehalt** (Salary) | Ücret, maaş adaleti | ✅ Var (detaylı) |
| 7 | **Image** (Company Image) | Şirket imajı, marka değeri | ❌ Yok |
| 8 | **Führung** (Leadership) | Yönetim kalitesi, liderlik | ❌ Yok |
| 9 | **Aufgaben** (Tasks) | İşin ilgi çekiciliği, çeşitlilik | ❌ Yok |
| 10 | **Kollegen** (Colleagues) | Ekip dinamikleri, iş arkadaşları | ❌ Yok |
| 11 | **Umwelt** (Environment) | Çevresel sürdürülebilirlik | ❌ Yok |
| 12 | **Sozialleistungen** (Benefits) | Yan haklar, sosyal olanaklar | ❌ Yok |
| 13 | **Altersvorsorge** (Pension) | Emeklilik planları | ❌ Yok |
| 14 | **Gleichbehandlung** (Equality) | Eşitlik, çeşitlilik, kapsayıcılık | ❌ Yok |
| 15 | **Interessante Aufgaben** (Interesting Tasks) | İşin zorluğu ve ilgi çekiciliği | ❌ Yok |
| 16 | **Unternehmenskultur** (Culture) | Şirket kültürü, değerler | 🟡 Kısmen |
| 17 | **Vorgesetztenverhalten** (Manager Behavior) | Yönetici davranışları | ❌ Yok |
| 18 | **Weiterbildung** (Training) | Eğitim olanakları | ❌ Yok |

### 📝 Önerilen Implementasyon:

```typescript
// Yeni ratingCategories tablosu
interface RatingCategory {
  id: string;
  company_id: string;
  user_id: string;
  
  // 18 boyut
  atmosphere: number;        // 1-5
  communication: number;     // 1-5
  work_life_balance: number; // 1-5
  workplace: number;         // 1-5
  career: number;            // 1-5
  salary: number;            // 1-5
  image: number;             // 1-5
  leadership: number;        // 1-5
  tasks: number;             // 1-5
  colleagues: number;        // 1-5
  environment: number;       // 1-5
  benefits: number;          // 1-5
  equality: number;          // 1-5
  culture: number;           // 1-5
  manager_behavior: number;  // 1-5
  training: number;          // 1-5
  
  created_at: string;
}

// Ağırlıklı ortalama hesaplama
const OVERALL_RATING_WEIGHTS = {
  atmosphere: 1.0,
  communication: 0.9,
  work_life_balance: 1.2,    // Yüksek öncelik
  career: 1.0,
  salary: 1.1,
  leadership: 1.0,
  culture: 0.9,
  // ... diğerleri
};
```

---

## 🔍 Kununu'da Olan, Firmascope'da Olmayan Özellikler

### 1. **Şirket Yanıt Sistemi (Employer Responses)**
- **Kununu**: Şirketler yorumlara resmi yanıt verebilir
- **Firmascope**: Henüz yok
- **Öncelik**: 🔴 Yüksek
- **Implementasyon**: 
  - `company_responses` tablosu
  - Şirket adminleri yanıt yazabilir
  - Kullanıcılara bildirim gönder

### 2. **Doğrulanmış İncelemeler (Verified Reviews)**
- **Kununu**: İş e-postası ile doğrulanmış yorumlar "✓ Verified" badge'i alır
- **Firmascope**: Şu an anonim, doğrulama yok
- **Öncelik**: 🟡 Orta
- **Implementasyon**:
  - İş e-postası ile doğrulama akışı
  - `is_verified` boolean alanı
  - Badge gösterimi

### 3. **Şirket İçi Görüntüler (Office Photos)**
- **Kununu**: Çalışanlar ofis fotoğrafları paylaşabilir
- **Firmascope**: Sadece admin upload yapabilir
- **Öncelik**: 🟢 Düşük
- **Not**: Şirket kültürünü yansıtmak için önemli

### 4. **Maaş Aralıkları ve Grafikler**
- **Kununu**: Pozisyon bazlı maaş dağılım grafikleri
- **Firmascope**: Sadece tek tek maaş girişleri
- **Öncelik**: 🟡 Orta
- **Implementasyon**:
  - Histogram/grafik gösterim
  - Percentil hesaplama (P25, P50, P75, P90)
  - Pozisyon bazlı karşılaştırma

### 5. **Kariyer Sayfaları ve İş İlanları**
- **Kununu**: Şirketler kariyer sayfaları oluşturabilir, iş ilanı verebilir
- **Firmascope**: Sadece temel bilgiler
- **Öncelik**: 🟢 Düşük (iş ilanı sitesi değiliz)

### 6. **Raporlama ve Analiz Araçları**
- **Kununu**: Şirketler için detaylı analiz dashboard'u
- **Firmascope**: Temel admin paneli var
- **Öncelik**: 🟡 Orta

### 7. **SSS ve Şirket Hakkında Daha Fazla Bilgi**
- **Kununu**: Yapılandırılmış şirket bilgileri (yan haklar, çalışma saatleri vb.)
- **Firmascope**: Sadece açıklama alanı
- **Öncelik**: 🟡 Orta

---

## 📱 Platform ve Teknik Özellikler

### Kununu'da Olan Teknik Özellikler:

| Özellik | Kununu | Firmascope | Öncelite |
|---------|--------|------------|----------|
| **Mobil Uygulama** | ✅ Native iOS/Android | ❌ Yok | 🔴 Kritik |
| **PWA** | ✅ Var | ❌ Yok | 🟡 Orta |
| **Push Notifications** | ✅ Var | ❌ Yok | 🟡 Orta |
| **Email Bildirimleri** | ✅ Akıllı | ❌ Yok | 🔴 Yüksek |
| **Gelişmiş Arama** | ✅ Filtre + AI öneri | 🟡 Temel | 🟡 Orta |
| **SEO** | ✅ Mükemmel | ❌ Yok | 🔴 Kritik |
| **Sitemap** | ✅ Dinamik | ❌ Yok | 🔴 Yüksek |
| **Structured Data** | ✅ Schema.org | ❌ Yok | 🟡 Orta |
| **SSO** | ✅ LinkedIn, Xing | ✅ Google only | 🟡 LinkedIn ekle |
| **API** | ✅ Açık API | ❌ Yok | 🟢 Düşük |

---

## 🎨 UX/UI Karşılaştırması

### Kununu'nun Güçlü Yanları:

1. **Şirket Sayfası Düzeni**
   - Üstte özet kart (puan, yorum sayısı, sektör sıralaması)
   - Sol sidebar: Hızlı navigasyon
   - Ana içerik: Tab bazlı organizasyon
   - Sağ sidebar: Benzer şirketler, kariyer fırsatları

2. **Değerlendirme Formu**
   - Adım adım wizard
   - Her kategori için açıklayıcı tooltip'ler
   - Otomatik kaydetme
   - Preview before submit

3. **Veri Görselleştirme**
   - Radar/spider chart (18 boyut)
   - Trend grafikleri (zaman içinde değişim)
   - Karşılaştırma araçları

### Firmascope İçin Öneriler:

```typescript
// Yeni Company Detail Layout
interface CompanyPageSections {
  hero: {
    logo: string;
    name: string;
    overallRating: number;
    totalReviews: number;
    rankInIndustry: string;
    location: string;
    size: string;
    industry: string;
  };
  
  quickStats: {
    recommendRate: number;
    salaryRange: { min: number; max: number };
    interviewDifficulty: number;
    growthOpportunities: number;
  };
  
  ratingBreakdown: {
    // 18 kategorinin radar chart'ı
    radarChart: RatingCategory[];
    // Detaylı tablo
    detailedTable: CategoryScore[];
  };
  
  tabs: {
    overview: CompanyOverview;
    reviews: Review[];
    salaries: Salary[];
    interviews: Interview[];
    photos: Photo[];
    benefits: Benefit[];
  };
}
```

---

## 🚀 Implementasyon Roadmap

### Faz 1: Temel İyileştirmeler (1-2 hafta)
- [ ] SEO meta tag'leri (dinamik title/description)
- [ ] Sitemap.xml oluşturma
- [ ] robots.txt optimizasyonu
- [ ] Structured data (Schema.org)
- [ ] Profil sayfası
- [ ] Şifre sıfırlama

### Faz 2: Değerlendirme Sistemi Geliştirme (2-3 hafta)
- [ ] 18 kategorili rating sistemi
- [ ] Yeni rating formu (wizard)
- [ ] Radar chart görselleştirme
- [ ] Kategori bazlı filtreleme
- [ ] Şirket karşılaştırma özelliği

### Faz 3: Şirket-Özellikler (2-3 hafta)
- [ ] Şirket yanıt sistemi
- [ ] Doğrulanmış yorumlar
- [ ] Şirket profili geliştirme
- [ ] Ofis fotoğrafı upload (çalışanlar için)
- [ ] Yan haklar/yararlar modülü

### Faz 4: Bildirim ve İletişim (1-2 hafta)
- [ ] Email bildirim sistemi
- [ ] Push notifications (PWA)
- [ ] Abonelik yönetimi
- [ ] Newsletter sistemi

### Faz 5: Mobil ve PWA (2-3 hafta)
- [ ] PWA desteği
- [ ] Service worker
- [ ] Offline mod
- [ ] Responsive optimizasyonu
- [ ] (Opsiyonel) React Native app

### Faz 6: Gelişmiş Özellikler (3+ hafta)
- [ ] Gelişmiş arama (ElasticSearch)
- [ ] AI destekli öneriler
- [ ] Trend analizleri
- [ ] Şirket karşılaştırma aracı
- [ ] Raporlama dashboard'u

---

## 📊 Kununu'nun İş Modelinden Dersler

### Gelir Kaynakları:
1. **Employer Branding Paketleri** - Şirketler özel sayfa satın alır
2. **Featured Listings** - Öne çıkan iş ilanları
3. **Analytics Dashboard** - Şirketler için detaylı analiz
4. **Review Campaigns** - Yorum toplama kampanyaları

### Firmascope İçin Öneriler:
- Ücretsiz temel kullanım (mevcut hali)
- "Pro" şirket paketi: Özelleştirilmiş sayfa, analizler, yanıt hakkı
- "Enterprise" paketi: API erişimi, özel entegrasyonlar

---

## 🎯 Sonuç ve Özet

### En Önemli Eksikler (Öncelik Sırasına Göre):

| # | Eksik | Etki | Çaba |
|---|-------|------|------|
| 1 | SEO Optimizasyonu | 🔴 Kritik | 🟢 Kolay |
| 2 | 18 Kategori Rating | 🔴 Kritik | 🟡 Orta |
| 3 | Email Bildirimleri | 🔴 Yüksek | 🟢 Kolay |
| 4 | Şirket Yanıtları | 🔴 Yüksek | 🟡 Orta |
| 5 | Maaş Grafikleri | 🟡 Orta | 🟡 Orta |
| 6 | PWA/Mobil | 🟡 Orta | 🔴 Zor |
| 7 | Doğrulanmış Yorumlar | 🟡 Orta | 🟡 Orta |
| 8 | Şirket Fotoğrafları | 🟢 Düşük | 🟢 Kolay |

### Hemen Yapılması Gerekenler:
1. **SEO** - Google'da görünmezsek büyüyemeyiz
2. **Detaylı Rating** - Tek boyutlu puan yetersiz
3. **Email sistemi** - Kullanıcı retention için kritik

---

*Bu analiz Kununu'nun kamuya açık özelliklerine ve kullanıcı deneyimine dayanmaktadır.*
