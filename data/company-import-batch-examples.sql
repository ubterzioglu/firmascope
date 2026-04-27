-- firmascope company import examples
-- Multi-row batch inserts for admin SQL upload
-- Notes:
-- 1. This format is ideal when importing 5-10 companies at once.
-- 2. Keep descriptions free of semicolons.
-- 3. Photos are optional and can be added later from the admin panel.

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES
  (
    'NovaAnaliz',
    'nova-analiz',
    'NA',
    'Arastirma, veri analizi ve performans olcumleme cozumleri sunan yazilim ekibi.',
    'Istanbul',
    'Teknoloji',
    '11-50',
    'A.S.',
    'Aktif'
  ),
  (
    'KariyerHaritasi',
    'kariyer-haritasi',
    'KH',
    'Aday deneyimi, ise alim surecleri ve insan kaynaklari teknolojileri gelistiren platform.',
    'Ankara',
    'Teknoloji',
    '11-50',
    'Ltd. Sti.',
    'Aktif'
  ),
  (
    'LojiMind',
    'lojimind',
    'LM',
    'Lojistik operasyon planlama ve rota optimizasyonu uzerine yazilim cozumleri gelistiren sirket.',
    'Kocaeli',
    'Lojistik',
    '51-200',
    'A.S.',
    'Aktif'
  ),
  (
    'EnerjiSurec',
    'enerji-surec',
    'ES',
    'Enerji yonetimi, saha verisi ve operasyon takibi odakli kurumsal yazilim urunleri sunar.',
    'Ankara',
    'Enerji',
    '51-200',
    'A.S.',
    'Aktif'
  ),
  (
    'MedyaRota',
    'medya-rota',
    'MR',
    'Icerik operasyonlari, reklam raporlama ve medya performansi icin dijital araclar saglar.',
    'Istanbul',
    'Medya',
    '11-50',
    'Ltd. Sti.',
    'Aktif'
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO companies (
  name, slug, initials, description, city, sector, size, company_type, status
) VALUES
  (
    'SaglikVeri',
    'saglik-veri',
    'SV',
    'Saglik kurumlari icin veri toplama, dashboard ve raporlama urunleri gelistiren ekip.',
    'Izmir',
    'Saglik',
    '11-50',
    'A.S.',
    'Aktif'
  ),
  (
    'UretimBulutu',
    'uretim-bulutu',
    'UB',
    'Uretim planlama, is emri ve dijital fabrika surecleri icin bulut tabanli cozumler sunar.',
    'Bursa',
    'Teknoloji',
    '51-200',
    'A.S.',
    'Aktif'
  ),
  (
    'AdayMotoru',
    'aday-motoru',
    'AM',
    'Aday havuzu yonetimi ve yetenek eslestirme alaninda urun gelistiren IK teknolojisi girisimi.',
    'Istanbul',
    'Teknoloji',
    '11-50',
    'Ltd. Sti.',
    'Aktif'
  ),
  (
    'FinVeriLab',
    'fin-veri-lab',
    'FV',
    'Risk analizi, raporlama ve finansal modelleme yazilimlari ureten veri odakli sirket.',
    'Istanbul',
    'Finans',
    '11-50',
    'A.S.',
    'Aktif'
  ),
  (
    'OperasyonPiksel',
    'operasyon-piksel',
    'OP',
    'Ic operasyonlar, denetim ve surec gorunurlugu icin kurumsal paneller gelistiren ekip.',
    'Antalya',
    'Teknoloji',
    '11-50',
    'Ltd. Sti.',
    'Aktif'
  )
ON CONFLICT (slug) DO NOTHING;
