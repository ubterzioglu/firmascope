# firmascope — AI Handover Document

> Bu döküman, projeyi devralan bir sonraki AI asistanı için hazırlanmıştır.

---

## Projeye Hızlı Bakış

**firmascope** bir şirket değerlendirme platformudur. Türkiye'deki şirketler hakkında anonim yorum, maaş ve mülakat bilgisi paylaşılır. Glassdoor Türkiye versiyonu gibi düşünülebilir.

---

## Kritik Bilgiler

### Mimari Kararlar
1. **Navbar yerine FirmaPill**: Klasik navbar kaldırıldı, yerine sağ üstte floating "firmascope" butonu konuldu (`FirmaPill.tsx`). Tıklanınca dropdown menü açılır. Navbar.tsx dosyası hâlâ var ama kullanılmıyor.

2. **Anonim Veri Gösterimi**: `reviews`, `salaries`, `interviews` tablolarında `user_id` var ama frontend'e public view'lar üzerinden (`reviews_public`, `salaries_public`, `interviews_public`) veri çekiliyor. Bu view'lar user_id'yi expose etmez.

3. **Type Casting**: Public view'lar Supabase types dosyasında tanımlı ama select sorgularında `as any` kullanılıyor (type uyumsuzluğu nedeniyle). Bu bir workaround.

4. **Auth Provider**: `useAuth` hook'u global `AuthProvider` ile sarılmış. `BrowserRouter` AuthProvider içinde. Google OAuth Lovable Cloud (`lovable.auth.signInWithOAuth`) üzerinden çalışır.

5. **Rate Limiting**: Trigger tabanlı — `enforce_rate_limit()` fonksiyonu reviews/salaries/interviews insert'lerinde çalışır. Saatte 5 gönderi limiti var.

6. **Salary Gating**: `has_submitted_salary()` RPC fonksiyonu ile kontrol edilir. Maaş paylaşmayan kullanıcılar, diğer maaş verilerini göremez (blur + overlay).

### Veritabanı Trigger'ları
> ⚠️ Supabase dashboard'da trigger'lar "yok" olarak görünebilir ama aslında migration dosyalarında tanımlıdır. Kontrol etmeden silmeyin.

Beklenen trigger'lar:
- `handle_new_user` → `auth.users` INSERT → `profiles` tablosuna satır ekler
- `enforce_rate_limit` → `reviews`, `salaries`, `interviews` BEFORE INSERT
- `validate_vote` → `votes` BEFORE INSERT/UPDATE

### Dosya Yapısı Notları
- `src/integrations/supabase/client.ts` ve `types.ts` **otomatik üretilir**, elle düzenlenmemeli
- `.env` dosyası otomatik yönetilir
- `supabase/config.toml` Lovable Cloud tarafından yönetilir
- Görseller `src/assets/` altında, büyük kısmı Unsplash URL'leri ile çekiliyor

### Stil Sistemi
- Tüm renkler `src/index.css`'te HSL custom property olarak tanımlı
- Tailwind config'de semantic token'lar kullanılıyor
- Komponentlerde direkt renk kullanımı yasak (`text-white` yerine `text-primary-foreground`)
- `card-elevated` utility class'ı var: `rounded-2xl border-2 border-border/80 bg-card shadow-md`

---

## Dikkat Edilmesi Gerekenler

### ❗ Yapma
- `src/integrations/supabase/` altındaki dosyaları elle düzenleme
- `.env` dosyasını düzenleme
- `supabase/config.toml` düzenleme
- Navbar.tsx'i aktif etme (FirmaPill kullanılıyor)
- Auth tablolarına (auth.users) foreign key ekleme
- CHECK constraint yerine trigger kullan

### ✅ Yap
- Yeni tablo eklerken RLS policy ekle
- Public view'lar üzerinden veri çek (user_id gizleme)
- Yeni renk eklerken `index.css` + `tailwind.config.ts`'e ekle
- Formlar için rate limiting trigger'ı ekle
- Edge function'larda secret'ları environment variable olarak kullan

---

## Proje Sahibi Bilgileri

- **Owner**: Umut Barış Terzioğlu (`ubterzioglu@gmail.com`)
- **Super Admin** rolüne sahip
- **Ortak**: Cenk (aynı hesapları kullanıyor)
- Admin rolü `user_roles` tablosunda tanımlı

---

## Mevcut Durumda Bilinen Sorunlar

1. **Profil sayfası eksik**: `/profil` rotası Navbar'da link olarak var ama sayfa oluşturulmamış
2. **Trigger'lar analytics'te görünmüyor**: Supabase info'da "no triggers" diyor ama migration'larda tanımlı, kontrol et
3. **Type casting workaround**: Public view sorgularında `as any` + `as unknown` kullanılıyor
4. **Carousel hızı**: 180s'e ayarlandı, kullanıcı hâlâ hızlı bulabilir

---

## Sık Kullanılan Supabase Komutları

```typescript
// Admin kontrolü
const { data } = await supabase.rpc("is_admin", { _user_id: userId });

// Salary gate kontrolü
const { data } = await supabase.rpc("has_submitted_salary", { p_user_id: userId });

// Public view'dan veri çekme
const { data } = await supabase.from("reviews_public").select("*").eq("company_id", id);

// Oy verme
const { error } = await supabase.from("votes").upsert({
  user_id, target_id, target_type, vote_type
}, { onConflict: "user_id,target_type,target_id" });
```
