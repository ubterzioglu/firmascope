# firmascope — Proje Durum Raporu

> Son güncelleme: 2026-02-08

---

## 1. Proje Özeti

**firmascope**, Türkiye'deki şirketler hakkında anonim değerlendirme, maaş bilgisi ve mülakat deneyimi paylaşma platformudur. Glassdoor benzeri bir konseptle, çalışanların kimliklerini gizli tutarak şirket kültürü, ücret politikaları ve işe alım süreçleri hakkında şeffaf bilgi edinmelerini sağlar.

---

## 2. Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Routing** | React Router v6 |
| **State / Data** | TanStack React Query |
| **Backend** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **Auth** | Supabase Auth (Email/Password + Google OAuth via Lovable Cloud) |
| **Deploy** | Vercel (frontend) + Supabase Cloud (backend) |

---

## 3. Sayfa Yapısı & Rotalar

| Rota | Sayfa | Açıklama |
|------|-------|----------|
| `/` | `Index.tsx` | Ana sayfa — hero, aksiyon menüsü, duyuru carousel, FAQ |
| `/sirketler` | `Companies.tsx` | Şirket listeleme — arama, şehir/sektör filtresi |
| `/sirket/:slug` | `CompanyDetail.tsx` | Şirket detay — genel bakış, yorumlar, maaşlar, mülakatlar |
| `/giris` | `Auth.tsx` | Giriş / Kayıt (Email + Google OAuth) |
| `/sirket-oner` | `SuggestCompany.tsx` | Kullanıcı şirket önerisi formu |
| `/admin` | `Admin.tsx` | Yönetim paneli (sadece admin rolü) |
| `/yasal` | `Legal.tsx` | KVKK, sorumluluk reddi, kullanım esasları |
| `*` | `NotFound.tsx` | 404 sayfası |

---

## 4. Veritabanı Tabloları

### Ana Tablolar
| Tablo | Açıklama |
|-------|----------|
| `companies` | Şirket bilgileri (ad, slug, sektör, şehir, boyut, logo, banner) |
| `reviews` | Şirket değerlendirmeleri (başlık, artılar, eksiler, puan, tavsiye) |
| `salaries` | Maaş bilgileri (pozisyon, miktar, döviz, deneyim yılı) |
| `interviews` | Mülakat deneyimleri (pozisyon, zorluk, sonuç, deneyim) |
| `profiles` | Kullanıcı profilleri (display_name, avatar) |
| `user_roles` | Rol atamaları (admin, moderator, user, company_admin) |
| `company_admins` | Şirket-admin eşleştirmeleri |
| `company_suggestions` | Kullanıcıların şirket önerileri |
| `company_claims` | Şirket sahiplenme talepleri |
| `votes` | Thumbs up/down oylama sistemi |
| `submission_logs` | Rate limiting için gönderi logları |
| `announcements` | Admin tarafından yönetilen duyurular |

### Public View'lar (RLS güvenliği için)
- `reviews_public` — user_id olmadan review verileri
- `salaries_public` — user_id olmadan maaş verileri
- `interviews_public` — user_id olmadan mülakat verileri

---

## 5. Temel Özellikler

### ✅ Tamamlanan Özellikler

#### Kullanıcı Sistemi
- Email/Password kayıt ve giriş
- Google OAuth entegrasyonu
- Otomatik profil oluşturma (trigger ile)
- Rol tabanlı erişim (Super Admin, Company Admin, User)

#### Şirket Yönetimi
- Şirket listeleme, arama, filtreleme (şehir + sektör)
- Şirket detay sayfası (4 sekmeli: Genel Bakış, Yorumlar, Maaşlar, Mülakatlar)
- Sektöre göre otomatik banner görselleri
- Admin panelinden şirket CRUD işlemleri
- Kullanıcıdan şirket önerisi alma (admin onayıyla)
- Şirket sahiplenme (claim) sistemi

#### Değerlendirme & Veri Paylaşımı
- Şirket değerlendirmesi yazma (puan, artılar, eksiler, tavsiye)
- Maaş bilgisi ekleme (pozisyon, miktar, döviz, deneyim)
- Mülakat deneyimi paylaşma (pozisyon, zorluk, sonuç)
- Tüm veriler anonimleştirilmiş (public view'lar ile user_id gizli)

#### Oylama Sistemi
- Thumbs up / thumbs down her içerik kartında
- Kullanıcı başına tek oy (toggle)
- "Faydalı" yüzde gösterimi

#### Give-to-Get Salary Gating
- Maaş bilgisi görmek için önce kendi maaşını paylaşma zorunluluğu
- Blur overlay + CTA

#### Rate Limiting
- Saatte 5 gönderi limiti (trigger tabanlı)
- reviews, salaries, interviews tablolarına uygulanır

#### Admin Paneli
- Duyuru yönetimi (CRUD)
- Şirket önerisi onay/red
- Şirket sahiplenme talep yönetimi
- Şirket CRUD
- Yorum/maaş/mülakat silme
- Kullanıcı listesi
- Özet istatistikler

#### UI / UX
- FirmaPill — sağ üstte sabit "firmascope" butonu, dropdown menü
- Duyuru carousel (infinite scroll, otomatik kayma)
- Floating dots arka plan animasyonu
- WhyFirmascope — FAQ bölümü
- Yasal bilgiler sayfası
- Responsive tasarım (mobil uyumlu)
- Light/dark mode desteği (CSS token bazlı)

---

## 6. Komponent Yapısı

```
src/
├── components/
│   ├── AdminAnnouncements.tsx    # Admin duyuru CRUD
│   ├── AnnouncementCarousel.tsx  # Duyuru slider
│   ├── CTASection.tsx            # CTA bölümü
│   ├── FirmaPill.tsx             # Floating menü butonu
│   ├── FloatingDot.tsx           # Arka plan animasyon noktaları
│   ├── Footer.tsx                # Alt bilgi
│   ├── InterviewForm.tsx         # Mülakat formu
│   ├── Layout.tsx                # Genel sayfa layout
│   ├── Navbar.tsx                # Navigasyon (kullanılmıyor, FirmaPill aldı)
│   ├── NavLink.tsx               # Aktif rota stili helper
│   ├── ReviewForm.tsx            # Değerlendirme formu
│   ├── SalaryForm.tsx            # Maaş bilgisi formu
│   ├── SalaryGateOverlay.tsx     # Maaş gating overlay
│   ├── VoteButtons.tsx           # Thumbs up/down
│   ├── WhyFirmascope.tsx         # FAQ accordion
│   └── WhySection.tsx            # Neden firmascope bölümü
├── hooks/
│   ├── useAuth.tsx               # Auth context & provider
│   ├── useSalaryGate.tsx         # Salary gating logic
│   └── use-toast.ts              # Toast hook
├── pages/
│   ├── Index.tsx                 # Ana sayfa
│   ├── Companies.tsx             # Şirket listesi
│   ├── CompanyDetail.tsx         # Şirket detay
│   ├── Auth.tsx                  # Giriş/Kayıt
│   ├── Admin.tsx                 # Yönetim paneli
│   ├── SuggestCompany.tsx        # Şirket önerisi
│   ├── Legal.tsx                 # Yasal bilgiler
│   └── NotFound.tsx              # 404
└── integrations/
    ├── supabase/client.ts        # Supabase client (auto-generated)
    └── supabase/types.ts         # DB types (auto-generated)
```

---

## 7. Veritabanı Fonksiyonları

| Fonksiyon | Açıklama |
|-----------|----------|
| `is_admin(uuid)` | Kullanıcının admin olup olmadığını kontrol eder |
| `has_role(uuid, role)` | Kullanıcının belirli bir role sahip olup olmadığını kontrol eder |
| `is_company_admin(uuid, uuid)` | Kullanıcının belirli şirketin admini olup olmadığını kontrol eder |
| `has_submitted_salary(uuid)` | Salary gating için maaş paylaşıp paylaşmadığını kontrol eder |
| `handle_new_user()` | Yeni kullanıcı kaydında otomatik profil oluşturur (trigger) |
| `update_updated_at_column()` | updated_at alanını otomatik günceller |
| `enforce_rate_limit()` | Saatte 5 gönderi limiti uygular |
| `validate_vote()` | Oy verilerinin geçerliliğini kontrol eder |

---

## 8. Tasarım Sistemi

- **Fontlar**: Plus Jakarta Sans (display) + Inter (body)
- **Renk Paleti**: HSL tabanlı CSS custom properties
  - Primary: `195 100% 42%` (cyan-blue)
  - Marka renkleri: alm-blue, alm-green, alm-orange, alm-yellow, alm-teal, alm-red
- **Komponent Kütüphanesi**: shadcn/ui (Radix UI primitives)
- **Tema Desteği**: Light + Dark mode (CSS variable bazlı)
- **Animasyonlar**: Float, drift, scroll-left, fadeSlideUp

---

## 9. Bilinen Eksikler / Yapılacaklar

- [ ] Profil sayfası (`/profil` rotası var ama sayfa yok)
- [ ] Şifre sıfırlama akışı
- [ ] Şirket arama — autocomplete/debounce optimizasyonu
- [ ] Email bildirim sistemi
- [ ] Şirket karşılaştırma özelliği
- [ ] SEO meta tag'leri (dinamik title/description)
- [ ] PWA desteği
- [ ] Moderatör rolü aktifleştirme
- [ ] Company Admin dashboard
- [ ] İçerik raporlama sistemi
