# firmascope Admin Sirket Ekleme Rehberi

Bu rehber, adminlerin kendi 100 sirketlik listelerini hazirlayip admin paneli uzerinden SQL dosyasi ile sisteme eklemesi icindir.

## Calisma modeli

- Toplam hedef: 300 sirket
- Dagilim: 100 + 100 + 100
- Her admin once kendi 100 sirketlik listesini cikarir
- Sonra bu sirketleri ornek SQL formatina cevirip admin panelinden yukler
- Mevcut sirketler su an placeholder kabul edilmeli

## 1. Deep search ile sirket listesini cikar

- Kendi 100 sirketlik segmentini once listele
- Mümkunse sektor, sehir veya kategori bazli ilerle
- Her sirket icin minimum su alanlari topla:
  - sirket adi
  - kisa aciklama
  - sehir
  - sektor
  - calisan araligi
  - sirket tipi

## 2. Duplicate kontrolu yap

- Admin panelindeki mevcut sirket listesinde arama yap
- Ozellikle su alanlari kontrol et:
  - ayni sirket adi
  - ayni slug
- Ayni sirket zaten varsa tekrar ekleme

## 3. SQL dosyasini hazirla

Repo icindeki ornekler:

- `data/company-import-single-examples.sql`
- `data/company-import-batch-examples.sql`

Kullanilacak kolonlar:

- `name`
- `slug`
- `initials`
- `description`
- `city`
- `sector`
- `size`
- `company_type`
- `status`

### Kurallar

- Dosya uzantisi `.sql` olmali
- Sadece `INSERT INTO companies (...) VALUES ... ON CONFLICT (slug) DO NOTHING;` formatini kullan
- Aciklama metinlerinde noktalı virgül kullanma
- `slug` kucuk harf ve tireli olmali
- `status` alani `Aktif` kalabilir
- `logo_url` ve `banner_url` zorunlu degil

## 4. Admin panelinden yukle

- `Admin > Sirketler` sekmesine gir
- `SQL Dosyasi Yukle` alanindan `.sql` dosyasini sec
- `SQL Dosyasini Calistir` butonuna bas
- Yukleme sonucu ozet olarak gorunur:
  - statement sayisi
  - eklenen kayit
  - atlanan kayit
  - hata satirlari

## 5. Yukleme sonrasi kontrol listesi

- Sirketler listesinde yeni kayitlar gorunuyor mu
- Duplicate slug nedeniyle atlanan satir var mi
- Yanlis sehir veya sektor girisi var mi
- Placeholder sirketlerle karismayan mantikli kayitlar olustu mu

## 6. Gorseller

- Logo ve banner bu turda zorunlu degil
- Once sirketleri sisteme ekleyin
- Gorseller daha sonra admin panelinden sirket bazli girilebilir

## Ornek slug kurali

- `Acme Yazilim` -> `acme-yazilim`
- `Selin Tech AI` -> `selin-tech-ai`

## Onerilen is akisi

1. 100 sirketlik listeyi deep search ile cikarin
2. Listeyi duplicate acisindan temizleyin
3. SQL dosyasini ornek formata gore hazirlayin
4. Admin panelinden yukleyin
5. Sonuc ozetini kontrol edin
6. Gerekirse eksik gorselleri sonra tamamlayin
