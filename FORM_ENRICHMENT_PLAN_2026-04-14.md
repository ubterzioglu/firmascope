# firmascope Form Genişletme Planı

**Tarih:** 2026-04-14
**Hedef dosya:** `FORM_ENRICHMENT_PLAN_2026-04-14.md`

## Özet

Amaç, şirket yorumu, maaş ve mülakat formlarını daha fazla karşılaştırılabilir veri toplayacak şekilde genişletmek; ama bunu kullanıcıya düşük friction ile sunmak. Mevcut formlar bugün veri topluyor, ancak kıyaslama, segmentleme ve filtreleme için fazla sığ kalıyor.

Referans olarak yalnızca repo içinde bulunan `12.png` incelendi. `23.png` mevcut olmadığı için plan sadece bu görsel ve mevcut kod tabanı üzerinden çıkarıldı.

Varsayılan ürün kararı:
- Şirket yorumu formu: `12.png` benzeri 3 adımlı wizard
- Maaş formu: 2 adımlı wizard
- Mülakat formu: 2 adımlı hafif wizard
- Şirket detay sayfasında şirket zaten seçili olduğu için "şirket seç" adımı gösterilmez

## Şirket Yorumu Formu

### Mevcut durum

Bugünkü yorum formu sadece şunları topluyor:
- başlık
- artılar
- eksiler
- genel puan
- tavsiye eder / etmez

Bu, içerik üretmek için yeterli ama şu sorulara cevap veremiyor:
- aynı şirkette farklı ekip deneyimleri nasıl ayrışıyor?
- eski çalışan ile aday görüşü ne kadar farklı?
- uzaktan çalışanların deneyimi farklı mı?
- hangi boyut güçlü, hangi boyut zayıf?

### Hedef akış

### Adım 1 - Temel bağlam

Zorunlu alanlar:
- `rating` (genel puan)
- `recommends` (tavsiye eder mi)
- `reviewer_relationship`
  - `current_employee`
  - `former_employee`
  - `applicant`

Opsiyonel alanlar:
- `position_level`
  - `individual_contributor`
  - `manager`
  - `executive`
  - `intern`
  - `freelancer_or_contractor`
- `department`
- `work_model`
  - `onsite`
  - `hybrid`
  - `remote`

Bu adımın amacı, yorumu karşılaştırılabilir hale getiren minimum bağlamı toplamak.

### Adım 2 - Detay puanlar

Tamamı opsiyonel, yıldızlı seçim ile:
- `rating_work_atmosphere`
- `rating_communication`
- `rating_team_spirit`
- `rating_work_life_balance`
- `rating_manager_behavior`
- `rating_tasks`
- `rating_compensation_benefits`
- `rating_career_growth`

UI kararı:
- tek uzun liste yerine 3 grup halinde sunulur:
  - `Kültür`
  - `Çalışma Ortamı`
  - `Kariyer ve Ücret`

Amaç:
- kullanıcıyı uzun metin yazmaya zorlamadan yapısal sinyal toplamak

### Adım 3 - Serbest metin ve yan bilgiler

Opsiyonel:
- `title`
- `pros`
- `cons`
- `benefits` (`text[]` / chip seçimi)

Önerilen benefit seçenekleri:
- `remote_work`
- `flexible_hours`
- `meal_card`
- `private_healthcare`
- `bonus`
- `transport_support`
- `education_budget`
- `stock_or_equity`

### Başlık politikası

`title` kullanıcı için opsiyonel yapılır.
Boş bırakılırsa submit anında otomatik üretilir.

Örnek:
- `Mevcut çalışan görüşü · 4/5`
- `Eski çalışan görüşü · 2/5`
- `Aday deneyimi · 3/5`

### Zorunlu / opsiyonel kararı

Zorunlu:
- genel puan
- tavsiye durumu
- ilişki tipi

Opsiyonel:
- diğer tüm alanlar

### Neden bu kadar?

Şirket yorumu formu en yüksek friction riski taşıyan form. Bu yüzden sadece kıyaslama için kritik omurga zorunlu tutulur; detay alanlar isteğe bırakılır.

## Maaş Formu

### Mevcut durum

Bugünkü maaş formu:
- pozisyon
- maaş tutarı
- para birimi
- deneyim yılı

Bu veri tekil maaş paylaşımı için yeterli ama insanlar şu karşılaştırmaları yapmak isteyecek:
- aynı şirkette junior vs senior farkı
- tam zamanlı vs stajyer farkı
- net mi brüt mü
- departman bazlı fark
- hibrit / remote etkisi

### Hedef akış

### Adım 1 - Maaş omurgası

Zorunlu alanlar:
- `job_title`
- `salary_amount`
- `currency`
- `salary_basis`
  - `net`
  - `gross`
- `experience_years`
- `employment_type`
  - `full_time`
  - `part_time`
  - `intern`
  - `contractor`
- `seniority_level`
  - `junior`
  - `mid`
  - `senior`
  - `lead`
  - `manager`
  - `director`

### Adım 2 - Karşılaştırma detayları

Opsiyonel alanlar:
- `department`
- `work_model`
- `location_city`
- `bonus_amount_yearly`
- `equity_or_stock`
- `benefits` (`text[]`)

### Zorunlu / opsiyonel kararı

Zorunlu:
- pozisyon
- maaş
- para birimi
- net / brüt
- deneyim yılı
- çalışma tipi
- seniority

Opsiyonel:
- departman
- şehir
- bonus
- hisse / equity
- yan haklar
- çalışma modeli

### Ürün kararı

Bu formda zorunlu alan sayısı review formuna göre daha yüksek olacak. Çünkü burada ana hedef doğrudan kıyaslama üretebilmek.

### Bu fazda yapılmayacak

- maaşı aylık / yıllık / saatlik gibi çoklu periyot sistemine taşımak
- satın alma gücü / enflasyon normalize etme
- şehir bazlı ücret endeksi üretme

Şimdilik aylık mantık korunur.

## Mülakat Formu

### Mevcut durum

Bugünkü mülakat formu:
- pozisyon
- deneyim anlatımı
- zorluk
- sonuç

Bu form okunabilir içerik sağlıyor ama süreç kıyaslaması için çok az veri topluyor.

### Hedef akış

### Adım 1 - Temel mülakat çerçevesi

Zorunlu:
- `position`
- `difficulty`
- `result`

Opsiyonel:
- `interview_year`
- `interview_type`
  - `onsite`
  - `remote`
  - `hybrid`

### Adım 2 - Süreç detayları

Opsiyonel:
- `stage_count`
- `has_case_study`
- `response_time_days`
- `salary_discussed`
- `offered_salary_amount`
- `offered_salary_currency`
- `experience` (serbest metin, mevcut alan)

### Koşullu görünüm

- `offered_salary_amount` yalnızca sonuç `Teklif Aldım` ise gösterilir
- `offered_salary_currency` yalnızca teklif maaşı girilmişse gösterilir

### Zorunlu / opsiyonel kararı

Zorunlu:
- pozisyon
- zorluk
- sonuç

Opsiyonel:
- süreç detayı
- serbest anlatım
- teklif bilgisi
- geri dönüş süresi

Bu form en hafif form olarak kalmalı. Aksi halde doldurma isteği düşer.

## Şema / Tip / Arayüz Değişiklikleri

### Veritabanı

Güncellenecek tablolar:
- `reviews`
- `salaries`
- `interviews`

Güncellenecek public view'lar:
- `reviews_public`
- `salaries_public`
- `interviews_public`

### Tipler

- Supabase generated types güncellenecek
- frontend insert/update payload tipleri yeni alanları kapsayacak

### Frontend

Güncellenecek ana bileşenler:
- `ReviewForm`
- `SalaryForm`
- `InterviewForm`

Güncellenecek ekranlar:
- company detail içindeki form açma akışları
- admin edit dialog'ları
- company detail kart render'ları

### Şema ilkeleri

- yeni alanlar geriye uyumluluk için başlangıçta nullable eklenir
- frontend validation yeni kayıtlar için zorunlu alanları uygular
- eski kayıtlar null alanlarla sorunsuz görünmeye devam eder
- enum benzeri alanlar implementasyon sırasında `text + check constraint` ile tutulur
- review `title` nullable yapılmaz; frontend boşsa otomatik doldurur

## UI / Friction İlkeleri

### Genel ilke

Kullanıcıyı "uzun form" ile korkutmadan veri toplamak için:
- ilk adımda sadece karar verdiren kısa alanlar
- ikinci adımda hızlı seçimler
- son adımda opsiyonel yazı alanları

### Kullanılacak input desenleri

- boolean için segmented buttons veya switch
- enum için chip group / segmented control
- çoklu seçim için chip toggles
- detay puanlar için yıldız satırları
- uzun metin en sona

### Kaçınılacak şeyler

- ilk ekranda 10+ alan
- gereksiz dropdown yağmuru
- hepsi zorunlu yaklaşımı
- aynı bilgiyi iki farklı biçimde istemek

### Şirket yorumu için özel UX kararı

`12.png` benzeri hissiyat korunur:
- progress göstergesi
- her adımın tek sorumluluğu olması
- "opsiyonel" alanların net etiketlenmesi

## Test Planı

### Schema / data

- migration'lar uygulanınca tüm yeni alanlar oluşmalı
- public view'lar yeni alanları expose etmeli
- eski kayıtlar null alanlarla bozulmadan görünmeli

### Form davranışı

- adım geçişlerinde state kaybolmamalı
- zorunlu alanlar olmadan ilerleme engellenmeli
- opsiyonel alanlar boş bırakılarak submit edilebilmeli
- review title boşsa otomatik üretilmeli

### UI

- mobile ve desktop'ta stepper düzgün çalışmalı
- chip grupları taşmamalı
- yıldızlı alanlar layout kaydırmamalı

### Entegrasyon

- submit payload'ları DB ile uyumlu olmalı
- company detail kartlarında yeni alanlar bozulmadan gösterilmeli
- admin edit ekranları yeni alanları okuyup güncelleyebilmeli

## Varsayımlar

- `23.png` henüz yok; plan yalnızca `12.png` ve mevcut repo üzerinden hazırlandı
- bu fazda yeni karşılaştırma dashboard'u yapılmayacak
- önce veri toplama kalitesi artırılacak
- şirket yorumu formunda friction minimum tutulacak
- maaş formunda karşılaştırma değeri daha kritik olduğu için zorunlu alan sayısı daha yüksek olacak
- mülakat formu en hafif form olarak kalacak
