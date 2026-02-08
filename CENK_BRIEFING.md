# firmascope — Cenk Bilgilendirme Dökümanı

> Hazırlayan: AI Asistan | Tarih: 2026-02-08

---

## Proje Nedir?

**firmascope**, Türkiye'deki şirketler hakkında anonim olarak değerlendirme, maaş ve mülakat deneyimi paylaşılan bir platform. Glassdoor'un Türkiye versiyonu gibi düşünebilirsin.

---

## Ne Yaptık? (Özet)

### 🏗️ Platform Altyapısı
- React + TypeScript + Tailwind CSS ile modern frontend
- Supabase ile backend (veritabanı, authentication, güvenlik)
- Google ile giriş + email/şifre ile kayıt sistemi
- Rol tabanlı yetkilendirme (Super Admin → sen ve Umut, Company Admin → şirket sahipleri, User → normal kullanıcı)

### 📊 Ana Özellikler
- **Şirket Listeleme**: Şehir ve sektör filtreleriyle arama
- **Şirket Detay Sayfası**: 4 sekmeli (Genel Bakış, Yorumlar, Maaşlar, Mülakatlar)
- **Anonim Değerlendirme**: Puan, artılar/eksiler, tavsiye eder/etmez
- **Maaş Bilgisi Paylaşma**: Pozisyon, miktar, deneyim yılı
- **Mülakat Deneyimi**: Pozisyon, zorluk, sonuç
- **Oylama Sistemi**: Her içeriğe thumbs up/down
- **Give-to-Get**: Maaş bilgisi görmek için önce kendi maaşını paylaşman gerekir
- **Rate Limiting**: Saatte max 5 gönderi (spam koruması)

### 🛡️ Admin Paneli
- Duyuru yönetimi
- Şirket ekleme/düzenleme
- Kullanıcı şirket önerisi onay/red
- Şirket sahiplenme talep yönetimi
- Yorum/maaş/mülakat silme
- İstatistik özeti

### 🎨 Tasarım
- "firmascope" floating butonu (sağ üstte) — tıklayınca menü açılır
- Duyuru carousel'i (otomatik kayan kartlar)
- Arka planda yüzen renkli noktalar
- Koyu/açık tema desteği
- Mobil uyumlu responsive tasarım

### 📜 Yasal
- KVKK uyumlu yasal bilgiler sayfası
- Sorumluluk reddi
- Kullanım esasları

---

## Altyapı & Erişim Bilgileri

### 🌐 URL'ler
| Ne | Adres |
|----|-------|
| **Canlı Site** | https://firmascope2026.lovable.app |
| **Preview** | https://id-preview--02b9ae6d-f19a-40f8-b294-47bbf23dfff6.lovable.app |
| **Lovable Editor** | Lovable dashboard üzerinden erişim |

### 🗄️ Supabase (Backend)
| Bilgi | Değer |
|-------|-------|
| **Project Ref** | `oosjerypgrvqvfnsncbq` |
| **Dashboard** | Lovable Cloud üzerinden erişiliyor |
| **Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (public, kodda var) |
| **Service Role Key** | 🔐 Secret olarak saklanıyor (Umut'ta) |

### 🚀 Deploy (Vercel)
| Bilgi | Değer |
|-------|-------|
| **Platform** | Vercel |
| **Hesap** | Umut'un hesabı (aynı hesabı paylaşıyorsunuz) |
| **Kullanıcı** | `ubterzioglu@gmail.com` |

### 📦 GitHub
| Bilgi | Değer |
|-------|-------|
| **Hesap** | Umut'un GitHub hesabı |
| **Kullanıcı** | `ubterzioglu@gmail.com` |
| **Repo** | _(Umut'tan repo linkini iste)_ |

### 🔐 Şifreler & Gizli Anahtarlar
> Şifreler bu dökümanda yer almaz. Umut'tan iste:
> - Supabase Service Role Key
> - Vercel hesap erişimi
> - GitHub repo erişimi
> - Google OAuth client credentials

---

## Veritabanı Yapısı (Basitleştirilmiş)

```
companies ──────── Şirket bilgileri (ad, sektör, şehir, boyut)
reviews ─────────── Değerlendirmeler (puan, artılar, eksiler)
salaries ────────── Maaş verileri (pozisyon, miktar)
interviews ──────── Mülakat deneyimleri
profiles ────────── Kullanıcı profilleri
user_roles ──────── Admin/moderatör/user rolleri
company_admins ──── Şirket-admin eşleşmeleri
company_suggestions  Kullanıcı şirket önerileri
company_claims ───── Şirket sahiplenme talepleri
votes ───────────── Oylama (thumbs up/down)
announcements ────── Duyurular
```

---

## Yapılacaklar Listesi

- [ ] Profil sayfası
- [ ] Şifre sıfırlama
- [ ] Şirket karşılaştırma
- [ ] Email bildirimleri
- [ ] SEO optimizasyonu
- [ ] Moderatör paneli
- [ ] Company Admin dashboard
- [ ] İçerik raporlama
- [ ] PWA desteği

---

## Notlar

- Tüm kullanıcı verileri anonimdir — frontend'de user_id görünmez
- Rate limiting var, bir kullanıcı saatte max 5 içerik paylaşabilir
- Maaş verilerini görmek için önce kendi maaşını paylaşmak zorunlu
- Admin paneline sadece `user_roles` tablosunda admin rolü olan kullanıcılar erişebilir
- Platform sahibi: **Umut Barış Terzioğlu** (`ubterzioglu@gmail.com`)
