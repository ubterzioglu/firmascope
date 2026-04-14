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

## Teknik Yapılacaklar

Bu bölüm, implementasyonu küçük ve bağımsız teslim edilebilir fazlara ayırır. Amaç tek seferde büyük refactor yapmak değil; veri kontratını önce sabitlemek, sonra form bazlı ilerlemek, en sonda ortaklaştırma ve QA temizliği yapmaktır.

### Faz 1 - Veri kontratı ve altyapı hazırlığı

- [ ] **T1 - Alan kontratını tek tabloda netleştir**
  `reviews`, `salaries`, `interviews` için eklenecek tüm yeni alanları tek matriste topla.
  Her alan için şu bilgiler net yazılsın:
  - teknik alan adı
  - tablo adı
  - veri tipi
  - nullable durumu
  - frontend'de zorunlu mu opsiyonel mi
  - örnek değer
  - enum ise izin verilen değerler
  Bu adımın çıktısı implementation sırasında tekrar karar vermeyi önleyen sabit veri sözlüğü olmalı.

- [ ] **T2 - Migration kapsamını tasarla**
  Üç tablo için eklenecek kolonları ve gerekiyorsa `check constraint` kurallarını yaz.
  Bu adımda ayrıca şu kararlar açık olsun:
  - hangi kolonlar `text`
  - hangi kolonlar `integer`
  - hangi kolonlar `boolean`
  - hangi kolonlar `text[]`
  - hangi enum benzeri alanlar `text + check constraint` ile tutulacak
  Geriye uyumluluk için yeni kolonların başlangıçta nullable ekleneceği açıkça belirtilsin.

- [ ] **T3 - Public view güncelleme listesini çıkar**
  `reviews_public`, `salaries_public`, `interviews_public` içinde hangi yeni alanların açılacağını tek tek listele.
  İlk fazda sadece veri akışını bozmamak öncelikli olduğu için, tüketici ekranlarda henüz kullanılmasa bile view tarafında expose edilmesi gereken alanlar netleşsin.

- [ ] **T4 - Frontend tip ve payload sözleşmesini güncelle**
  Supabase generated type güncellemesi sonrası frontend insert/update payload'larının hangi alanları okuyup yazacağı açıkça tanımlansın.
  Özellikle şu dönüşümler kararlaştırılsın:
  - boş string -> `null`
  - boş çoklu seçim -> `[]` veya `null`
  - numeric input -> `number | null`
  - koşullu alan gizlendiğinde değer temizlenecek mi korunacak mı
  Bu adım bittikten sonra form implementasyonunda veri şekli hakkında belirsizlik kalmamalı.

### Faz 2 - Review formunun genişletilmesi

- [ ] **T5 - Review veri modelini çıkar**
  Review form state yapısı mevcut tek parça yapıdan step bazlı yapıya taşınsın.
  Ayrı ayrı tanımlanacak state kümeleri:
  - temel bağlam alanları
  - detay puan alanları
  - serbest metin alanları
  - yan hak çoklu seçimi
  Ayrıca title auto-generate fonksiyonu için giriş/çıkış kuralı yazılsın.

- [ ] **T6 - Review stepper iskeletini kur**
  3 adımlı akış kurulmalı:
  - Adım 1: genel puan, tavsiye durumu, ilişki tipi, opsiyonel bağlam alanları
  - Adım 2: detay puanlar
  - Adım 3: başlık, artılar, eksiler, benefits
  Step navigation davranışı net olsun:
  - geri butonu state silmez
  - ileri butonu sadece ilgili adımın zorunlu alanlarını kontrol eder
  - son adım submit tetikler

- [ ] **T7 - Review alan bileşenlerini uygula**
  Adım 1 için chip/segmented seçimleri, adım 2 için yıldız satırları, adım 3 için metin ve chip seçimleri uygulanmalı.
  Özellikle şu alan grupları görünür biçimde ayrılmalı:
  - reviewer relationship
  - work model
  - position level
  - kültür / çalışma ortamı / kariyer puanları
  Uzun dropdown yerine hızlı seçim bileşenleri tercih edilmeli.

- [ ] **T8 - Review submit mapping'ini bağla**
  `reviews` insert payload'ı tüm yeni alanları içerecek şekilde güncellensin.
  Submit öncesi şu kurallar uygulanmalı:
  - title boşsa otomatik üret
  - opsiyonel text alanları trim sonrası boşsa `null`
  - opsiyonel rating alanları seçilmemişse `null`
  - benefits boşsa tek tip davranış seçilsin
  Başarılı submit sonrası mevcut `onSuccess` akışı bozulmamalı.

### Faz 3 - Salary formunun genişletilmesi

- [ ] **T9 - Salary veri modelini çıkar**
  Salary form için state iki kümeye ayrılmalı:
  - zorunlu maaş omurgası
  - opsiyonel karşılaştırma detayları
  Numeric alanlar için parse kuralları açıkça tanımlansın:
  - `salary_amount`
  - `experience_years`
  - `bonus_amount_yearly`
  Boolean/enum alanlar için default veya boş durumlar da netleştirilsin.

- [ ] **T10 - Salary 2 adımlı akışı kur**
  Adım 1'de zorunlu alanlar toplansın:
  - job title
  - salary amount
  - currency
  - salary basis
  - experience years
  - employment type
  - seniority level
  Adım 2'de opsiyonel alanlar yer alsın:
  - department
  - work model
  - location city
  - bonus
  - equity
  - benefits
  Salary gate davranışı ve `onSuccess` zinciri aynı kalmalı.

- [ ] **T11 - Salary submit mapping ve validasyonunu tamamla**
  `salaries` insert payload'ı yeni alanları kapsayacak şekilde güncellensin.
  Validasyon şu sırayla çalışsın:
  - zorunlu metin alanları boş mu
  - zorunlu numeric alanlar geçerli mi
  - enum alanlar izin verilen değerlerden biri mi
  - opsiyonel numeric alanlar boşsa `null`
  Bu adım sonunda salary form kendi başına üretime yakın davranış vermeli.

### Faz 4 - Interview formunun genişletilmesi

- [ ] **T12 - Interview veri modelini çıkar**
  Interview form için state şu bloklara ayrılmalı:
  - temel mülakat çerçevesi
  - süreç detayları
  - teklif bilgisi
  - serbest deneyim metni
  Özellikle `Teklif Aldım` durumunda açılacak alanlar bu adımda kesinleştirilsin.

- [ ] **T13 - Interview 2 adımlı akışı uygula**
  Adım 1:
  - position
  - difficulty
  - result
  - interview year
  - interview type
  Adım 2:
  - stage count
  - case study
  - response time
  - salary discussed
  - offered salary amount/currency
  - experience text
  Form hafif tutulmalı; opsiyonel alanlar boşken submit edilebilmeli.

- [ ] **T14 - Interview koşullu görünüm ve submit mapping'ini tamamla**
  Şu davranışlar net uygulanmalı:
  - sonuç `Teklif Aldım` değilse offered salary alanları gizli
  - salary discussed false ise teklif alanları gerekirse temizlenir
  - experience boşsa `null`
  - numeric opsiyonel alanlar boşsa `null`
  Böylece veri tabanına yarım ama tutarlı kayıt gidebilir.

### Faz 5 - Yönetim ekranları ve veri uyumu

- [ ] **T15 - Admin review edit formunu genişlet**
  Admin tarafında review düzenleme formu yeni alanları okuyup kaydedebilsin.
  İlk sürümde wizard gerekmez; tek form içinde düz alan yerleşimi yeterli.
  Ancak yeni alanlar eksik kalmamalı:
  - reviewer relationship
  - work model
  - position level
  - detay puanlar
  - benefits

- [ ] **T16 - Admin salary ve interview edit formlarını genişlet**
  Salary ve interview düzenleme alanları da yeni veri kontratıyla hizalanmalı.
  Burada amaç UX parlatmak değil, kayıtları tam düzenlenebilir hale getirmek.
  Özellikle select/input tipleri veri tipiyle uyumlu olmalı.

- [ ] **T17 - Company detail veri okuma uyumunu kontrol et**
  `reviews_public`, `salaries_public`, `interviews_public` sorguları yeni alanlar eklendiğinde hata vermemeli.
  İlk fazda tüm alanları UI'da göstermek şart değil.
  Ama şu iki şey doğrulanmalı:
  - fetch kırılmıyor
  - mevcut kart render'ları bozulmuyor

### Faz 6 - Ortaklaştırma, temizlik ve doğrulama

- [ ] **T18 - Ortak sabitleri ve yardımcıları ayır**
  Tekrarlanan seçim listeleri tek bir ortak modülde toplanmalı.
  Ayrıştırılacak adaylar:
  - enum seçenek dizileri
  - benefit seçenekleri
  - review title generator
  - boş değer normalize yardımcıları
  Amaç tekrar eden string ve mapping riskini azaltmak.

- [ ] **T19 - Edge-case temizliği yap**
  Uygulama genelinde şu davranışlar tekilleştirilsin:
  - form kapanıp açılınca state reset mi korunma mı
  - geri tuşunda veri kaybı yaşanıyor mu
  - gizlenen koşullu alanların eski değeri submit oluyor mu
  - `0`, boş string, `null` ayrımı doğru mu
  Bu adım, feature tamamlandıktan sonra kalite turu olarak ele alınmalı.

- [ ] **T20 - Test ve QA turunu tamamla**
  Her form için minimum senaryolar doğrulansın:
  - happy path
  - required validation
  - optional boş gönderim
  - mobile görünüm
  - desktop görünüm
  - admin edit sonrası tekrar kaydetme
  Bu turdan sonra plan dokümanında tamamlanan maddeler işaretlenmeye hazır hale gelmeli.

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
