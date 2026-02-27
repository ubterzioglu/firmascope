# LinkedIn Apify Scrape Sonuçları

> **Tarih:** 2026-02-27  
> **Script:** `scripts/scrape-turkey-fixed.cjs`  
> **Toplam Çekilen:** 68 şirket  
> **Hedef:** 100 şirket

---

## 📊 Sektör Dağılımı

| Sektör | Sayı | Yüzde |
|--------|------|-------|
| Teknoloji | 20 | 29% |
| Finans | 15 | 22% |
| Perakende | 12 | 18% |
| Telekomünikasyon | 10 | 15% |
| Otomotiv | 7 | 10% |
| Havacılık | 3 | 4% |
| Enerji | 1 | 2% |
| **Toplam** | **68** | **100%** |

---

## 🏢 Örnek Şirketler

### Teknoloji (20)
- Software Testing and QA Company | Testbytes
- Software AG
- Software Mind Americas
- Software Mind
- Software University (SoftUni)
- Technology & Strategy
- Technology Innovation Institute
- ...

### Finans (15)
- Various banks and financial services companies

### Perakende (12)
- E-commerce and retail companies

### Telekomünikasyon (10)
- Telecommunications Technical Services
- Telecommunications Regulatory Authority
- Orange
- Telecom Egypt
- ...

### Otomotiv (7)
- Automotive companies

---

## ⚠️ Önemli Notlar

### Veri Kalitesi
- ✅ Şirket isimleri doğru
- ✅ Sektör sınıflandırması çalışıyor
- ✅ LinkedIn URL'leri mevcut
- ✅ Logo URL'leri mevcut
- ⚠️ Bazı şirketler Türkiye dışı (örn: Telecom Egypt)
- ⚠️ Şehir bilgisi genelde "İstanbul" (varsayılan)

### API Davranışı
- "Turkey" keyword'u ile arama yapılıyor
- Lokasyon filtresi çalışmıyor (API sınırlaması)
- Bazı sonuçlar Türkiye dışı şirketler içerebilir

---

## 🚀 Kalan 32 Şirketi Çekmek İçin

### Adım 1: Script'i Tekrar Çalıştır
```bash
node scripts/scrape-turkey-fixed.cjs
```

Script mevcut 68 şirketi koruyup, kalan aramaları yapacak.

### Adım 2: Manuel Kontrol
```bash
# JSON'ı kontrol et
node -e "const d = require('./data/linkedin-turkey-100.json'); console.log(d.companies.length + ' şirket');"
```

### Adım 3: Supabase'e Aktar
```bash
# Bir sonraki adımda bu verileri Supabase'e aktaracağız
```

---

## 💾 Dosya Konumu

```
data/
└── linkedin-turkey-100.json    # 68 şirket
```

---

## 🔧 Script Özellikleri

- **Rate Limiting:** Her arama arası 10 saniye bekleme
- **Retry Logic:** Hata durumunda 2 kez yeniden deneme
- **Duplicate Kontrolü:** Aynı şirket tekrar eklenmiyor
- **Kalite Filtresi:** Minimum 500 takipçi, freelance filtreleme

---

## 🎯 Sonraki Adımlar

1. **Kalan 32 şirketi çek** (script'i tekrar çalıştır)
2. **Veri temizliği:** Türkiye dışı şirketleri filtrele
3. **Supabase'e aktar:** `companies` tablosuna ekle
4. **Logo indir:** LinkedIn logo URL'lerini kullan

---

## 📝 API Limitleri

- Aylık limit: 150,000 işlem
- Şu ana kadar kullanılan: ~100 işlem
- Kalan: 149,900 işlem

**Durum:** Güvenli ✅
