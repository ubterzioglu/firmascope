# firmascope — Proje Durum Raporu

> **Son Güncelleme:** 2026-02-27  
> **Ortam:** Vercel Production (https://www.firmascope.com)  
> **Backend:** Supabase Cloud (Project Ref: `jhgtjldygapeztuoetng`)

---

## 📋 Proje Özeti

**firmascope**, Türkiye'deki şirketler hakkında anonim değerlendirme, maaş bilgisi ve mülakat deneyimi paylaşım platformudur. Glassdoor benzeri bir konseptle çalışanların kimliklerini gizli tutarak şirket kültürü, ücret politikaları ve işe alım süreçleri hakkında şeffaf bilgi edinmelerini sağlar.

---

## 🏗️ Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
|--------|-----------|----------|
| **Frontend** | React 18 + TypeScript + Vite | Modern, tip-güvenli UI geliştirme |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS ve Radix UI bileşenleri |
| **State/Data** | TanStack React Query | Sunucu durum yönetimi ve önbellekleme |
| **Routing** | React Router v6 | SPA routing ve navigasyon |
| **Backend** | Supabase | PostgreSQL, Auth, Storage, Realtime |
| **Auth** | Supabase Auth | Email/Password + Google OAuth (PKCE) |
| **Deploy** | Vercel | CDN, otomatik deploy, preview URL'leri |

---

## 🗺️ Sayfa Yapısı & Rotalar

| Rota | Bileşen | Açıklama | Yetki |
|------|---------|----------|-------|
| `/` | `Index.tsx` | Ana sayfa - Hero, aksiyon menüsü, duyuru carousel, FAQ | Herkese açık |
| `/sirketler` | `Companies.tsx` | Şirket listeleme - arama, şehir/sektör filtresi | Herkese açık |
| `/sirket/:slug` | `CompanyDetail.tsx` | Şirket detay - 4 sekme (Genel Bakış, Yorumlar, Maaşlar, Mülakatlar) | Herkese açık |
| `/giris` | `Auth.tsx` | Giriş/Kayıt - Email/Şifre + Google OAuth | Misafir |
| `/sirket-oner` | `SuggestCompany.tsx` | Şirket öneri formu | Giriş yapmış kullanıcı |
| `/admin` | `Admin.tsx` | Yönetim paneli (9 sekme) | Sadece admin |
| `/sirket-yonetimi` | `CompanyAdmin.tsx` | Şirket admin dashboard'u | Sadece company_admin |
| `/yasal` | `Legal.tsx` | KVKK, sorumluluk reddi, kullanım esasları | Herkese açık |
| `*` | `NotFound.tsx` | 404 sayfası | Herkese açık |

---

## 🗄️ Veritabanı Yapısı

### Ana Tablolar

```
┌─────────────────────┬──────────────────────────────────────────────────────┐
│ Tablo               │ Açıklama                                             │
├─────────────────────┼──────────────────────────────────────────────────────┤
│ companies           │ Şirket bilgileri (ad, slug, sektör, şehir, boyut)    │
│ reviews             │ Değerlendirmeler (başlık, artılar, eksiler, puan)    │
│ salaries            │ Maaş bilgileri (pozisyon, miktar, döviz, deneyim)    │
│ interviews          │ Mülakat deneyimleri (pozisyon, zorluk, sonuç)        │
│ profiles            │ Kullanıcı profilleri (display_name, avatar)          │
│ user_roles          │ Rol atamaları (admin, moderator, user, company_admin)│
│ company_admins      │ Şirket-admin eşleşmeleri                             │
│ company_suggestions │ Kullanıcı şirket önerileri                           │
│ company_claims      │ Şirket sahiplenme talepleri                          │
│ votes               │ Thumbs up/down oylama sistemi                        │
│ reports             │ İçerik raporlama                                     │
│ announcements       │ Admin tarafından yönetilen duyurular                 │
│ submission_logs     │ Rate limiting için gönderi logları                   │
└─────────────────────┴──────────────────────────────────────────────────────┘
```

### Güvenlik View'ları (Anonimleştirilmiş)

- `reviews_public` — `user_id` olmadan review verileri
- `salaries_public` — `user_id` olmadan maaş verileri
- `interviews_public` — `user_id` olmadan mülakat verileri

Bu view'lar sayesinde frontend'de içerik sahiplerinin kimlikleri görünmez.

### Row Level Security (RLS)

Tüm tablolarda RLS aktif. Temel politikalar:
- **Herkese açık okuma:** `companies`, `announcements`, `votes` (SELECT)
- **Kendi verisi:** `profiles`, `reviews`, `salaries`, `interviews` (kullanıcı kendi verisini yönetir)
- **Admin yetkisi:** `user_roles`, tüm tabloların yönetimi

---

## ✅ Tamamlanan Özellikler

### 🔐 Kimlik Doğrulama & Yetkilendirme

| Özellik | Durum | Detay |
|---------|-------|-------|
| Email/Password kayıt | ✅ Tamamlandı | Zod validasyonlu, e-posta onayı gerekli |
| Email/Password giriş | ✅ Tamamlandı | Hata mesajları Türkçe |
| Google OAuth | ✅ Tamamlandı | PKCE flow, Supabase OAuth |
| Otomatik profil oluşturma | ✅ Tamamlandı | Auth trigger ile |
| Rol tabanlı erişim | ✅ Tamamlandı | Admin/Company Admin/User rolleri |
| Session yönetimi | ✅ Tamamlandı | LocalStorage persistence |

### 🏢 Şirket Yönetimi

| Özellik | Durum | Detay |
|---------|-------|-------|
| Şirket listeleme | ✅ Tamamlandı | Arama + şehir/sektör filtreleme |
| Şirket detay sayfası | ✅ Tamamlandı | 4 sekme, responsive |
| Otomatik banner | ✅ Tamamlandı | Sektöre göre Unsplash görselleri |
| Logo/banner upload | ✅ Tamamlandı | Supabase Storage `company-assets` bucket |
| Şirket öneri sistemi | ✅ Tamamlandı | Kullanıcı önerir, admin onaylar |
| Şirket sahiplenme | ✅ Tamamlandı | Talep sistemi, admin onayı |

### 📝 İçerik Paylaşımı

| Özellik | Durum | Detay |
|---------|-------|-------|
| Değerlendirme yazma | ✅ Tamamlandı | Puan (1-5), artılar, eksiler, tavsiye |
| Maaş bilgisi ekleme | ✅ Tamamlandı | Pozisyon, miktar, döviz, deneyim yılı |
| Mülakat deneyimi | ✅ Tamamlandı | Pozisyon, zorluk, sonuç, deneyim |
| Anonimlik | ✅ Tamamlandı | Public view'lar ile user_id gizli |
| Rate limiting | ✅ Tamamlandı | Saatte 5 gönderi limiti (trigger) |
| Give-to-Get gating | ✅ Tamamlandı | Maaş görmek için önce paylaşma zorunluluğu |

### 👍 Sosyal Özellikler

| Özellik | Durum | Detay |
|---------|-------|-------|
| Oylama sistemi | ✅ Tamamlandı | Thumbs up/down, toggle davranışı |
| Raporlama | ✅ Tamamlandı | İçerik raporlama, admin panelinde görünür |
| İstatistikler | ✅ Tamamlandı | Ortalama puan, tavsiye oranı, içerik sayıları |

### 🎨 UI/UX

| Özellik | Durum | Detay |
|---------|-------|-------|
| FirmaPill navigasyonu | ✅ Tamamlandı | Sağ üstte sabit, dropdown menü |
| Duyuru carousel | ✅ Tamamlandı | Infinite scroll, otomatik kayma |
| Floating dots animasyonu | ✅ Tamamlandı | Arka plan animasyonu |
| WhyFirmascope FAQ | ✅ Tamamlandı | Accordion bileşeni |
| Responsive tasarım | ✅ Tamamlandı | Mobil, tablet, desktop uyumlu |
| Dark/Light mode | ✅ Tamamlandı | CSS variable bazlı tema |
| Toast bildirimleri | ✅ Tamamlandı | Sonner + shadcn toaster |

### 🛠️ Admin Paneli

Admin paneli (`/admin`) 9 sekmeden oluşur:

1. **Duyurular** — CRUD işlemleri
2. **Öneriler** — Şirket önerilerini onaylama/red
3. **Talepler** — Şirket sahiplenme taleplerini yönetme
4. **Şirketler** — CRUD + logo/banner upload
5. **Yorumlar** — Silme işlemleri
6. **Maaşlar** — Silme işlemleri
7. **Mülakatlar** — Silme işlemleri
8. **Kullanıcılar** — Liste görünümü
9. **Raporlar** — İçerik raporlarını yönetme

---

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── AdminAnnouncements.tsx    # Admin duyuru CRUD
│   ├── AdminReports.tsx          # Admin rapor yönetimi
│   ├── AnnouncementCarousel.tsx  # Duyuru slider/carousel
│   ├── CTASection.tsx            # CTA bölümü
│   ├── FirmaPill.tsx             # Ana navigasyon (floating)
│   ├── FloatingDot.tsx           # Arka plan animasyon noktaları
│   ├── Footer.tsx                # Alt bilgi
│   ├── InterviewForm.tsx         # Mülakat formu
│   ├── Layout.tsx                # Genel sayfa layout
│   ├── ReviewForm.tsx            # Değerlendirme formu
│   ├── SalaryForm.tsx            # Maaş formu
│   ├── SalaryGateOverlay.tsx     # Maaş gating overlay
│   ├── VoteButtons.tsx           # Thumbs up/down
│   ├── ReportButton.tsx          # İçerik raporlama
│   ├── WhyFirmascope.tsx         # FAQ accordion
│   ├── WhySection.tsx            # Neden firmascope
│   └── ui/                       # shadcn/ui bileşenleri (50+ dosya)
│
├── hooks/
│   ├── useAuth.tsx               # Auth Context & Provider
│   ├── useSalaryGate.tsx         # Give-to-Get gating mantığı
│   ├── use-toast.ts              # Toast hook
│   └── use-mobile.tsx            # Mobil breakpoint hook
│
├── pages/
│   ├── Index.tsx                 # Ana sayfa
│   ├── Companies.tsx             # Şirket listesi
│   ├── CompanyDetail.tsx         # Şirket detay
│   ├── CompanyAdmin.tsx          # Şirket admin paneli
│   ├── Auth.tsx                  # Giriş/Kayıt
│   ├── Admin.tsx                 # Yönetim paneli
│   ├── SuggestCompany.tsx        # Şirket önerisi
│   ├── Legal.tsx                 # Yasal bilgiler
│   └── NotFound.tsx              # 404 sayfası
│
├── integrations/
│   └── supabase/
│       ├── client.ts             # Supabase client (auto-generated)
│       └── types.ts              # Database TypeScript tipleri
│
├── lib/
│   └── utils.ts                  # Utility fonksiyonları (cn)
│
├── App.tsx                       # Ana uygulama bileşeni
├── main.tsx                      # Entry point
└── index.css                     # Global stiller, CSS variables
```

---

## 🎨 Tasarım Sistemi

### Renk Paleti

```css
/* Primary */
--primary: 195 100% 42%        /* Cyan-Blue */

/* Brand Colors */
--alm-blue: 199 99% 47%        /* Mavi */
--alm-green: 79 100% 37%       /* Yeşil */
--alm-orange: 12 92% 52%       /* Turuncu */
--alm-yellow: 44 100% 50%      /* Sarı */
--alm-teal: 168 80% 38%        /* Turkuaz */
--alm-red: 348 83% 52%         /* Kırmızı */
```

### Fontlar

- **Display:** Plus Jakarta Sans (600, 700, 800)
- **Body:** Inter (400, 500, 600)

### Animasyonlar

- `float` — Yüzen nokta animasyonu (5s)
- `float-slow` — Yavaş yüzme (7s)
- `drift` — Sürüklenme (9s)
- `fadeSlideUp` — Giriş animasyonu
- `scroll-left` — Carousel kaydırma (180s)

---

## ⚙️ Ortam Değişkenleri

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://jhgtjldygapeztuoetng.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Vercel (Deployment)
VERCEL_PROJECT=firmascope
```

---

## 🚀 Deploy & CI/CD

### Vercel Production

```powershell
# Deploy komutu
vercel --prod

# Veyo GitHub push ile otomatik deploy
```

### Supabase Migrations

```powershell
# CLI ile migration uygulama
supabase link --project-ref jhgtjldygapeztuoetng
supabase db push
```

---

## ⚠️ Bilinen Sınırlamalar & Eksikler

### Eksik Özellikler (Yapılacaklar)

| Özellik | Öncelik | Durum |
|---------|---------|-------|
| Profil sayfası (`/profil`) | 🟡 Orta | Rota yok, kullanıcı kendi verilerini göremiyor |
| Şifre sıfırlama akışı | 🟡 Orta | Sadece e-posta onaylı kayıt var |
| Şirket karşılaştırma | 🟢 Düşük | Karşılaştırma aracı yok |
| Email bildirim sistemi | 🟡 Orta | Supabase Edge Functions gerekebilir |
| SEO meta tag'leri | 🟡 Orta | Dinamik title/description yok |
| PWA desteği | 🟢 Düşük | Service worker yok |
| Moderatör rolü | 🟢 Düşük | DB'de var ama aktif değil |
| Company Admin dashboard | 🟡 Orta | Sayfa var ama içerik sınırlı |
| İçerik raporlama (detaylı) | 🟢 Düşük | Temel raporlama var |
| Şirket arama optimizasyonu | 🟡 Orta | Debounce + autocomplete yok |

### Teknik Borçlar

1. **TypeScript Casting:** Bazı Supabase sorgularında `as any` kullanımı var (örn: `reviews_public` view sorguları)
2. **Client-side Aggregation:** Şirket istatistikleri (ortalama puan) client-side hesaplanıyor, PostgreSQL view'a taşınabilir
3. **Image Optimization:** Şirket logoları/banner'ları için next/image benzeri optimizasyon yok

---

## 🔄 Son Değişiklikler (2026-02-08)

1. **Supabase Migration:** Yeni Supabase projesine taşındı (`jhgtjldygapeztuoetng`)
2. **Google OAuth Fix:** PKCE flow ile düzeltildi
3. **Admin Panel RLS Fix:** Admin'ler artık tüm profilleri listeleyebiliyor
4. **Logo/Banner Upload:** Admin panelinden şirket görselleri yüklenebiliyor
5. **Domain Ayarları:** `www.firmascope.com` production domain olarak ayarlandı

---

## 📊 İstatistikler (Canlı)

| Metrik | Değer | Not |
|--------|-------|-----|
| Aktif Şirket | 2+ | Mercedes-Benz Türk, test verileri |
| Kullanıcı | 5+ | Admin, test kullanıcıları |
| Veritabanı Tablosu | 15 | Tüm özellikler aktif |
| Migration | 10 | Tümü uygulandı |

---

## 🔒 Güvenlik Kontrol Listesi

- ✅ RLS tüm tablolarda aktif
- ✅ Auth middleware ile korumalı rotalar
- ✅ Rate limiting (saatte 5 gönderi)
- ✅ SQL Injection koruması (parameterized queries)
- ✅ XSS koruması (React escape)
- ⚠️ CORS ayarları Supabase'de kontrol edilmeli
- ⚠️ Rate limiting bypass kontrolü yapılmalı

---

## 📞 İletişim & Erişim

| Rol | Kullanıcı |
|-----|-----------|
| Super Admin | `ubterzioglu@gmail.com` |
| Admin | `admin@firmascope.com` |
| Admin | `cenkkarakuz@gmail.com` |

**Vercel Hesabı:** `ubterzioglu@gmail.com`  
**GitHub Repo:** `github.com/firmascope/firmascope`  
**Supabase Dashboard:** `supabase.com/dashboard/project/jhgtjldygapeztuoetng`

---

## 📝 Notlar

- Tüm kullanıcı verileri **anonimdir** — frontend'de `user_id` görünmez
- **Rate limiting** aktif: Bir kullanıcı saatte max 5 içerik paylaşabilir
- **Give-to-Get:** Maaş verilerini görmek için önce kendi maaşını paylaşmak zorunlu
- Admin paneline sadece `user_roles` tablosunda `admin` rolü olan kullanıcılar erişebilir
- Platform sahibi: **Umut Barış Terzioğlu**

---

*Bu doküman projenin mevcut durumunu yansıtmaktadır. Değişiklikler yapıldıkça güncellenmelidir.*
