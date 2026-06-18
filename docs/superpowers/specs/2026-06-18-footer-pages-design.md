# Footer İçerik Sayfaları — Tasarım Dokümanı

Tarih: 2026-06-18

## Amaç

Footer'a dikey ayraçla (`|`) ayrılmış 7 yeni sayfa eklenecek. Mevcut tek `/yasal` sayfası iptal edilip içeriği bu yeni sayfalara dağıtılacak. `/yasal` adresi kalıcı olarak `/kullanim-sartlari`'na yönlendirilecek.

## Sayfalar

| Sayfa | Rota | İndeks | İçerik Kaynağı |
|-------|------|--------|----------------|
| Hakkımızda | `/hakkimizda` | index,follow | Yeni metin — firmascope nedir, misyon, anonim değerlendirme nasıl çalışır |
| İletişim | `/iletisim` | index,follow | Yeni metin + mevcut "Veri Sorumlusu" adres/e-posta |
| Kariyer | `/kariyer` | index,follow | Yeni metin — küçük ekip, açık pozisyon yok ama iletişime açık |
| Gizlilik Politikası | `/gizlilik-politikasi` | index,follow | "Veri Sorumlusu", "Kişisel Verilerin İşlenmesi", "Veri Sahibi Hakları" |
| Kullanım Şartları | `/kullanim-sartlari` | index,follow | "Sorumluluk Reddi", "İfade Özgürlüğü", "Kullanıcı Sorumluluğu", "Şirketlerle Bağımsızlık", "İçerik Kaldırma", "Amaç Dışı Kullanım", "Uyuşmazlıklar", "Değişiklik Hakkı" |
| KVKK / GDPR / CCPA | `/kvkk-gdpr-ccpa` | index,follow | KVKK m.11 hakları + kısa GDPR/CCPA denklik notu |
| Çerez Politikası | `/cerez-politikasi` | index,follow | Yeni metin — analiz çerezleri (CookieConsentBanner metniyle uyumlu) |

## Mimari

**Tek yeniden kullanılabilir içerik modeli + ince sayfa sarmalayıcılar.**

- `src/lib/footer-pages.ts` — tüm Türkçe metin burada. Her sayfa için `{ title, intro, path, sections: { title, text }[] }` yapısı. Tüm kopya tek yerde, düzenlemesi kolay.
- `src/components/StaticContentPage.tsx` — `Legal.tsx`'teki kart düzenini (rounded-xl border kartlar) yeniden kullanan ortak bileşen. Layout, SeoHead, Breadcrumb, başlık + kart listesi render eder. Prop: `pageKey` veya doğrudan içerik objesi.
- `src/pages/` altında 7 ince sarmalayıcı: `About.tsx`, `Contact.tsx`, `Careers.tsx`, `PrivacyPolicy.tsx`, `TermsOfUse.tsx`, `Kvkk.tsx`, `CookiePolicy.tsx`. Her biri ilgili içeriği `StaticContentPage`'e geçirir.

Gerekçe: 7 neredeyse aynı dosya yerine kanıtlanmış kart düzeni paylaşılır; her sayfa kendi rotasında kalır (SEO/indeksleme için iyi).

## Footer

Tek "yasal bilgiler" linki yerine 7 link, dikey ayraçla ayrılır. Link listesi `footer-pages.ts`'ten beslenir (tek kaynak). Mobilde wrap eder (`flex-wrap`), ayraçlar `aria-hidden`.

## `/yasal` Temizliği ve Yönlendirme

Silinecek/güncellenecek:
- `src/pages/Legal.tsx` — silinir.
- `src/App.tsx` — `Legal` import'u kaldırılır; 7 yeni rota eklenir; `/yasal` için `<Navigate to="/kullanim-sartlari" replace />` rotası eklenir.
- `src/components/Footer.tsx` — 7 link + ayraç.
- `src/components/CookieConsentBanner.tsx` — link `/cerez-politikasi`'na.
- `src/components/FirmaPill.tsx` — "Yasal Bilgiler" → "Hakkımızda" (`/hakkimizda`).
- `src/lib/site.ts` — `NOINDEX_STATIC_ROUTES`'tan `/yasal` çıkar; `INDEXABLE_STATIC_ROUTES`'a 7 yeni rota eklenir.
- `public/sitemap.xml` — 7 yeni `<url>` (priority 0.4, changefreq monthly); `/yasal` referansı yoksa dokunulmaz.
- `public/robots.txt` — `Disallow: /yasal` satırı kaldırılır.
- `nginx.conf` — `map` bloğundaki regex'ten `yasal` çıkarılır; `/yasal` için `location = /yasal { return 301 /kullanim-sartlari; }` eklenir.

## Hata Yönetimi / Sınır Durumları

- Bilinmeyen `pageKey` → derleme zamanı tip hatası (içerik objeleri tipli).
- `/yasal` → `/kullanim-sartlari` hem SPA (React Router `Navigate`) hem sunucu (nginx 301) seviyesinde.

## Test / Doğrulama

- `npm run build` (veya bun) yeşil.
- TypeScript hatasız (`tsc`).
- Footer'daki 7 link doğru rotalara gidiyor.
- `/yasal` → `/kullanim-sartlari` yönlendiriyor.
- Yeni sayfalar `index,follow` meta ile render ediliyor.
