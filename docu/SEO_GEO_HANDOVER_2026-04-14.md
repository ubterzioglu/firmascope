# SEO/GEO Handover - 2026-04-14

Bu dokuman, SEO & GEO calismasinin durduruldugu noktayi ve kalan isi net sekilde devretmek icin olusturuldu.

## Tamamlanan Kisimlar

- FAZ 0: Test yayin banner eklendi.
- FAZ 1: Teknik SEO duzeltmeleri uygulandi.
  - canonical URL `https://www.firmascope.com/`
  - `og:image` ve `twitter:image` meta etiketleri
  - `robots.txt` AI bot izinleri + sitemap URL guncellemesi
  - `scripts/generate-sitemap.ts` eklendi
  - build komutu sitemap generation + vite build olacak sekilde guncellendi
  - `public/sitemap.xml` placeholder ve build overwrite akisi aktif
- FAZ 2: `react-helmet-async` kuruldu, `HelmetProvider` eklendi.
- FAZ 2.2: `src/lib/seo.ts` olusturuldu (meta + JSON-LD util).
- FAZ 2.3: Ana sayfalarin buyuk kisminda Helmet uygulamasi eklendi.
- FAZ 3: Structured data temel kurulumu yapildi.
  - Home: Organization, WebSite, WebPage, Breadcrumb
  - FAQ: 8 soru-cevap JSON-LD
  - Company detail: Organization + AggregateRating + Review + Breadcrumb
  - Companies list: Breadcrumb + ItemList (ilk 20)
- FAZ 4: Ana sayfa icerik optimizasyonu buyuk olcude uygulandi.
  - genisletilmis hero aciklamasi
  - direct-answer blok
  - ek SEO icerik bolumu
- FAZ 5: Breadcrumb component + temel sayfalara entegrasyon yapildi.
- FAZ 6: SpeakableSpecification ve semantic bloklarin temeli eklendi.
- FAZ 7: OG image eklendi, alt text iyilestirmeleri yapildi.
- FAZ 8: Font preconnect/preload ve route prefetch baglantilari eklendi.

## Dogrulama Sonucu

- `npm run build` basarili.
- Build sirasinda sitemap dinamik olarak uretiliyor.

## Bilinen Notlar

- `npm run lint` bu PR kapsami disinda kalan mevcut repo problemleri nedeniyle fail veriyor.
- Bu turde global lint borcu temizlenmedi.

## Kalan Isler (Oncelik Sirali)

1. FAZ 7.3: WebP + `<picture>` fallback paternini gorsellerde yayginlastir.
2. FAZ 8.3: Core Web Vitals odakli teknik iyilestirmeleri tamamla.
   - LCP hero preload ince ayari
   - CLS icin kritik gorsellerde width/height netlestirme
   - TTFB icin Vercel edge cache kontrolu
3. FAZ 9: `src/lib/keywords.ts` ve keyword engine entegrasyonu.
4. FAZ 10: Programmatic SEO (`/sektor/[slug]`, `/sehir/[slug]`) + sitemap genisletme.

## Push Kapsami

Bu commit/push, FAZ 0-8'in uygulanmis kisimlarini ve bu handover dokumanini icerir.
`.kilo/` altindaki lokal plan dosyalari commit kapsaminda degildir.
