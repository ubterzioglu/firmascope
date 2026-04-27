-- firmascope company import examples
-- Single-row inserts for admin SQL upload
-- Notes:
-- 1. Only INSERT INTO companies statements are allowed.
-- 2. Leave logo_url and banner_url out for now; they are optional.
-- 3. Keep descriptions free of semicolons.

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES (
  'Mdy Yazilim',
  'mdy-yazilim',
  'MY',
  'Kurumsal yazilim, web urunleri ve dijital donusum cozumleri sunan teknoloji sirketi.',
  'Istanbul',
  'Teknoloji',
  '11-50',
  'A.S.',
  'Aktif'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES (
  'Selin Tech',
  'selin-tech',
  'ST',
  'SaaS urun gelistirme, otomasyon ve veri analitigi alanlarinda calisan teknoloji ekibi.',
  'Ankara',
  'Teknoloji',
  '11-50',
  'Ltd. Sti.',
  'Aktif'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES (
  'VeriPusula',
  'veri-pusula',
  'VP',
  'Isletmeler icin raporlama, veri ambarı ve karar destek cozumleri ureten yazilim sirketi.',
  'Izmir',
  'Teknoloji',
  '51-200',
  'A.S.',
  'Aktif'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES (
  'Finloop',
  'finloop',
  'FL',
  'Finansal operasyon otomasyonu ve KOBI odakli muhasebe cozumleri gelistiren fintech sirketi.',
  'Istanbul',
  'Finans',
  '11-50',
  'A.S.',
  'Aktif'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES (
  'BulutKare',
  'bulutkare',
  'BK',
  'Bulut altyapisi, devops surecleri ve uygulama modernizasyonu hizmetleri veren teknoloji firmasi.',
  'Bursa',
  'Teknoloji',
  '11-50',
  'Ltd. Sti.',
  'Aktif'
)
ON CONFLICT (slug) DO NOTHING;
