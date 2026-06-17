# FirmaScope Genişletme Tasarımı

FirmaScope hali hazırda Türkiye odaklı anonim şirket değerlendirme platformu olarak React+TypeScript, Supabase ve shadcn/ui kullanılarak geliştirilmiştir. Mevcut mimaride `/sirketler` sayfası şirket listelemesini, `/sirket/:slug` sayfası ise “Genel Bakış, Yorumlar, Maaşlar, Mülakatlar” olmak üzere dört sekmeli şirket detay görünümünü sunmaktadır. Veritabanında `companies` (ad, sektör, şehir, boyut vb.), `reviews` (başlık, artılar, eksiler, puan vb.), `salaries` (pozisyon, miktar, döviz, deneyim) ve `interviews` (pozisyon, zorluk, sonuç) gibi tablolar bulunmaktadır. Aşağıda verilen öneriler, bu mevcut mimari göz önünde bulundurularak sıralanmıştır.

## 🏢 Şirket Profili Modülü

- **Mevcut Tablo:** `companies` tablosu şu anda şirket adı, slug, sektör, şehir, çalışan sayısı/boyut gibi temel alanları içeriyor. Bu yapıya ek olarak her şirketin **web sitesi** ve **sosyal medya hesapları** (ör. LinkedIn, Twitter, Facebook vb.) için alanlar eklenebilir. Örneğin yeni sütunlar `website_url`, `linkedin_url`, `twitter_url` gibi eklenebilir. 
- **Profil Bilgileri:** Şirket profili sayfasında kullanıcıya gösterilecek bilgiler aşağıdaki gibi gruplanabilir:
  - **Genel Bilgiler:** Şirket adı, sektör, kurulu çalışan sayısı, faaliyet gösterdiği şehirler vb.
  - **İletişim & Medya:** Resmi web sitesi linki, sosyal medya ikonlarına tıklanabilir bağlantılar (LinkedIn, Twitter, Instagram, Glassdoor vb.).
  - **Örnek Kod / Veri:** Var olan `companies` şemasında ad/şehir gibi bilgiler mevcut. Yeni alanlar eklenmesi durumunda Supabase üzerinde ek migration ile şema güncellenmeli, ön yüzde de `CompanyDetail.tsx` bileşenine bu alanlar gösterilmelidir.
- **UI Tasarımı:** Şirket profilinde, üst kısımda logo ve kapak görselinin altında yukarıdaki bilgilerin açık bir düzenle sunulması önerilir. Her bilgi “Sektör: X”, “Çalışan Sayısı: Y” gibi satırlarla listelenebilir. Sosyal medya bağlantıları için shadcn/ui veya ikon seti kullanılabilir. Örneğin `<Footer>` veya yeni bir `<CompanySocials>` bileşeni ile bu ikonlar eklenebilir.
- **Çok Şehir Desteği:** Birden fazla şehirde faaliyet gösteren şirketler için “Şehirler” alanı liste olarak eklenebilir (örn. İstanbul, Ankara). Bu durumda DB’de `locations` gibi ilişkisel tablo veya dizi alan kullanılabilir.

## ⭐ Çalışan Görüşleri (Değerlendirme) Modülü

- **Mevcut Özellik:** Kullanıcılar mevcutta anonim olarak şirket değerlendirmesi yazabiliyor. `reviews` tablosunda “başlık, artılar, eksiler, puan (1–5), tavsiye” gibi alanlar var.
- **Önerilen Geliştirmeler:** Kullanıcıların puanına ek olarak aşağıdaki alt kriterler eklenebilir:
  - **Maaş Memnuniyeti:** Çalışanlar maaşlarından ne kadar memnunlar.
  - **Yönetim Kalitesi:** Yöneticilerle ilgili puanlama.
  - **Kariyer Fırsatları:** Terfi/ilerleme imkanları.
  - **İş-Yaşam Dengesi:** İş yükü ve özel hayat dengesi.
  - **Uzaktan Çalışma:** Uzak/hibrit çalışma desteği.  
  Bu alt başlıklara 1–5 arası değerlendirme eklenmesi için `reviews` tablosuna yeni sütunlar (`salary_rating`, `management_rating` vb.) eklenebilir. Ön yüzde `ReviewForm.tsx` güncellenerek bu sorular sorulabilir.
- **Görünüm:** Şirket detay sayfasında “Çalışan Görüşleri” sekmesinde, her değerlendirmeyi üst kriterler ve alt puanlarıyla göstermek mümkün. Ayrıca şirket genelindeki ortalamalar grafik veya puan kartlarıyla özetlenebilir. Örneğin “Yönetim: 3.8/5 (123 oy)” gibi.
- **Veri Cinsinden Altyapı:** Eğer yeni alan eklenmezse, mevcut “puan” kolonunu farklı başlıklar altında dağıtmak yerine yorum metinlerinden çıkarım yapılabilir. Ancak netlik için yukarıdaki gibi ayrı alanlar eklemek daha doğru olacaktır.

## 💬 Mülakat Deneyimleri

- **Mevcut Durum:** `interviews` tablosunda pozisyon, zorluk seviyesi (1–10), sonuç (ör. “Teklif Aldım”) ve ek bir `deneyim` metin alanı var.
- **Öneriler:** Kullanıcıların mülakat deneyimlerini daha detaylı girmesi için “Süreç” (ör. kaç aşamalı görüşme), “Tavsiye” (sınav/pratik tavsiyeleri) gibi alt başlıklar eklenebilir. Örneğin:
  ```text
  Pozisyon: Senior QA Engineer  
  Süreç: 3 görüşme aşaması  
  Zorluk: 7/10  
  Sonuç: Teklif aldım  
  Tavsiyem: Xray ve Jira bilgisi soruldu.
  ```
  Bu ek bilgiler için ya `deneyim` metin alanının içeriğine yönlendirilir ya da yeni alanlar (`process_steps`, `advice`) eklenir.
- **UI Tasarım:** “Mülakat Deneyimleri” sekmesine bu detaylı formatta form ve gösterim eklenebilir. Varolan `<InterviewForm>` bileşeni genişletilerek “Süreç / Görüşme Sayısı” ve “Tavsiye” girişleri eklenebilir.

## 💰 Maaş Bilgileri

- **Mevcut Durum:** `salaries` tablosunda pozisyon, miktar, para birimi ve deneyim yılı saklanıyor. Zaten “Maaş bilgisi ekleme” özelliği tamamlanmış durumda.
- **Öneriler:** Şirket detayında aynı pozisyon ve lokasyon için girilen maaşları kullanarak **Min/Ortalama/Max** hesaplamak çok bilgilendirici olur. Örneğin:
  ```
  Yazılım Test Uzmanı – İstanbul  
  Min: 55.000 TL  
  Ortalama: 72.000 TL  
  Max: 95.000 TL  
  (15 bildirime göre)
  ```
  Bunu dinamik olarak hesaplamak için veritabanında SQL sorgusu veya uygulama tarafında React-Query ile hesaplama yapılabilir.
- **Görünüm:** “Maaşlar” sekmesinde gruplandırılmış olarak pozisyon ve şehir bazlı grafik veya kartlar gösterilebilir. Mevcut gating (Maaş görme için önce paylaşma) özelliği de (Give-to-Get) devam edebilir.

## 🚩 Kırmızı Bayraklar ve ✅ Artılar

- **Tanım:** Şirket detayında, kullanıcıların `reviews` içeriğinden **ortak şikayet ve olumlu yönleri** öne çıkaran bir özet bölümü eklenebilir.
- **Red (Kırmızı) Bayraklar:** Yorumlarda sıkça bahsedilen olumsuz konular (“Fazla mesai”, “Mikro yönetim”, “Düşük maaş” gibi) etiketlenip listelenebilir. Bunu kullanıcıların girdiği “eksiler” metinlerinden çıkarabilir veya her review formuna etiket ekleme (tag) özelliği eklenebilir.
- **Artılar:** Benzer şekilde “artılar” kısmında en sık vurgulanan avantajlar (örneğin “Uzaktan çalışma”, “Özel sağlık sigortası” vb.) vurgulanabilir.
- **Uygulama:** Şirket detay sayfasında yeni bir alt sekme veya “Özet” bölümü açılarak bu listeler gösterilebilir. En popüler 5-10 madde kırmızı bayraklar ve artılar olarak sıralanabilir.

## 🔗 Sosyal Medya Entegrasyonu

- **Şirketler İçin:** Her şirket profiline Facebook, Twitter, LinkedIn, Instagram vb. hesaplarının linklenmesi öngörülüyor. Böylece kullanıcılar tek tıkla firma sosyal medya sayfasına erişebilir.  
- **Kullanıcılar İçin:** Kullanıcı profil sayfasına (aşağıda) kişisel sosyal medya / iletişim bağlantıları eklenebilir (örneğin LinkedIn profili, kişisel web sitesi).
- **Teknik Gereksinimler:** Sosyal medya API’leri yerine genellikle basit URL bağlantıları yeterli olur. Ancak *“kaynak”* doğrulaması istenirse OAuth entegrasyonları planlanabilir. Örneğin, kullanıcının LinkedIn hesabını bağlamak için LinkedIn OAuth yapılabilir ve ek profil bilgileri çekilebilir.
- **UI Tasarım:** Sosyal hesap ikonları, ilgili alanlara küçük simgeler olarak yerleştirilebilir. Bunun için shadcn/ui veya React Icon kütüphaneleri kullanılabilir.

## 📝 Gönderi (Post) Sistemi

- **Yeni Tablo:** Kullanıcıların site içinde genel gönderi (post) paylaşabilmesi için `posts` gibi bir tablo eklenmeli. Alanlar: `id, user_id, content (metin), image_url, post_type, created_at` vb. “post_type” için enum (ör. ‘text’, ‘job_offer’, ‘job_search’) kullanılabilir.
- **Post Tipleri:** İstenen üç tip gönderi:
  1. **Düz Mesaj (Text):** Metin veya metin+görsel içerebilir. (Örn. Genel duyuru, tecrübe paylaşımı)
  2. **İş İlanı (Job Offer):** Bir şirketten açık pozisyon duyurusu. Ek olarak şirket ilişkilendirilir, pozisyon alanı gibi özel etiketler olabilir.
  3. **İş Arıyorum (Job Search):** Kullanıcının iş arama ilanı. Kullanıcıya ait olarak “Ben şu pozisyonda iş arıyorum” tarzı gönderi.
- **UI Tasarım:** Ana sayfada veya ayrı bir “Akış” sayfasında (feed) postların listelenebileceği bir bölüm açılabilir. Her posta kullanıcı avatarı, gönderi içeriği, görsel varsa thumbnail, tarih görünmeli. shadcn/ui Card bileşeni ile tasarım yapılabilir. Kullanıcı yeni post oluşturmak için “Yeni Gönderi Ekle” butonu ile form açar.
- **Resim Desteği:** Gönderiye ek görsel yükleme özelliği sunulacaksa Supabase Storage kullanılabilir. Zaten şirket logo/banner upload için `company-assets` bucket var; benzer bir bucket `post-images` olarak açılabilir.
- **Admin Panel:** Admin paneline, “Gönderiler” sekmesi eklenerek gönderilerin onay/silme gibi işlemleri yapılmalı. Ayrıca kullanıcılar arası istenmeyen içerim raporlaması için mevcut `reports` yapısı kullanılabilir.

## 🙍‍♀️ Kullanıcı Profil Sayfası

- **Rota:** `/profil` rotası projede var ancak sayfa boş / eksik durumda. Bu rota etkinleştirilmeli.
- **İçerik:** Kullanıcı profili, kullanıcının *display name*, avatar, biyografi gibi temel bilgileri içermeli. Ayrıca o kullanıcının yazdığı yorumlar, eklediği maaş veya mülakat deneyimleri listelenebilir. Kişisel sosyal medya hesaplarına bağlantı alanları da konabilir.
- **Kullanıcı Rolleri:** Mevcut `profiles` tablosunda `display_name` ve `avatar` var. Profil sayfasında bu bilgilerin yanı sıra gösterge olarak doldurulan içerik sayıları (toplam yorum, toplam paylaşılan maaş vb.) da eklenebilir.
- **UI Düzeni:** Kullanıcı profili, ana menüde veya FirmaPill menüsünde görünen “Profilim” linkiyle ulaşılmalı. Burada kullanıcı bilgileri ve bir düzenle (edit) butonu olmalı. Oturum açmamışsa bu sayfaya erişim kısıtlanmalı.
- **Veri Erişim:** Kullanıcı sadece kendi verilerini görüp düzenleyebilmeli. Veritabanı RLS politikalarında `profiles` ve ilişkili tablolar için “kendi verisi” kuralı zaten mevcut.

## ⚙️ Yönetici Paneli (Admin) Geliştirmeleri

- **Mevcut Yapı:** Admin paneli `/admin` rotasında 9 sekmeli olarak tasarlanmış durumda (Duyurular, Öneriler, Talepler, Şirketler, Yorumlar, Maaşlar, Mülakatlar, Kullanıcılar, Raporlar).
- **Yeni Sekmeler:** Eklenen özellikleri yönetebilmek için şu sekmeler eklenebilir:
  - **Gönderiler:** Kullanıcı postlarını listeler, spam veya uygunsuz içerikleri siler.
  - **Sosyal Medya Bağlantıları:** (Opsiyonel) Şirket veya kullanıcı sosyal hesap doğrulamalarını yönetebilir.
- **Arayüz Uyumu:** Varolan Admin layout’u korunmalı. shadcn/ui bileşenleri ile panel güncellenirken, yeni bileşenler (örn. `<AdminPosts.tsx>`) eklenerek sekmeler oluşturulabilir. RLS politikaları ile sadece admin/internel yetkili erişimi sağlanmalı.
- **Profil Talepleri:** Mevcutta `company_claims` ve `company_suggestions` bulunuyor. Geliştirmeyle birlikte kullanıcılar profil istekleri (şirket sahiplenme vb.) de yine mevcut “Talepler” sekmesinden yönetilebilir.

## 📈 Gelecekte Eklenebilecek Özellikler

- **Şirket Karşılaştırma:** Kullanıcılar iki şirketi seçip “maaş”, “yorumsayısı” vb. kriterlerde karşılaştırma yapabilmeli. (Status raporunda da önerilmiş.)
- **En İyi Şirket Listeleri:** Örneğin “En iyi QA şirketleri” veya “Uzaktan çalışma sunan en iyi şirketler” gibi filtreli sıralama. Bunlar dinamik sayfalar olarak hazırlanabilir.
- **SEO ve Bildirim:** Siteye SEO meta tag’ları eklenip, yeni gönderi veya onay için e-posta/ push bildirim sistemleri kurulabilir.
- **Şifre Sıfırlama ve Moderasyon:** Mevcut eksikler arasında şifre sıfırlama akışı ve moderatör rolü de var (Status rapor); ilerleyen sürümlerde tamamlanabilir.

## 🔄 E2E Test Senaryoları (Opus Claude Kodu)

Aşağıda FirmaScope’un kritik akışları için örnek bir uçtan uca test (E2E) senaryosu Opus Claude tarzı betimlenmiştir. Her adım, gerçek kullanıcı etkileşimlerini simüle edecek şekilde detaylandırılmıştır. (Bu kod parçacığını test otomasyon aracınıza uyarlayabilirsiniz.)

```plaintext
Agent('FirmaScope Temel Akış Testi') {
  Başlangıç:
    - Site ana sayfasını aç (URL: https://www.firmascope.com)
    - Ana sayfada "Şirketler" menüsünün göründüğünü doğrula
  Şirket Listesi:
    - "Şirketler" sayfasına git
    - En az bir şirket listelendiğini kontrol et (örneğin, Mercedes-Benz Turk görünmeli)
    - Arama çubuğuna bir sektör adı yaz (örn. "Otomotiv") ve sonuçları filtrele
  Şirket Detayı ve Yorum Ekleme:
    - Listeden bir şirkete tıkla
    - Şirket detay sayfasının dört sekmesini görebildiğini doğrula (Genel, Yorumlar, Maaşlar, Mülakatlar)
    - "Yorumlar" sekmesine geç
    - "Yeni Yorum Ekle" butonuna bas
    - Değerlendirme formunu doldur (Başlık, Puan=4, Artılar, Eksiler, Tavsiye vb.)
    - Formu gönder ve başarılı bildirim al
    - Yorumun anonim olarak listelendiğini kontrol et
  Maaş Bilgisi Ekleme:
    - "Maaşlar" sekmesine geç
    - "Yeni Maaş Ekle" formunu doldur (Pozisyon=QA, Miktar=60000, Para Birimi=TL, Deneyim=3 yıl)
    - Formu gönder ve başarılı bildirim al
    - Maaşın anonim olarak listelendiğini kontrol et
  Kullanıcı Profili:
    - Üst menüden "Profilim" linkine tıkla
    - Profil sayfasının yüklendiğini ve kullanıcı bilgilerini (adı, avatar) gösterdiğini kontrol et
    - Profilde “Yorumlarım” veya “Maaşlarım” gibi bölümlerin görünürlüğünü doğrula
  Sosyal Medya Bağlantısı:
    - Şirket detay sayfasında sosyal medya ikonlarına tıkla (örn. LinkedIn)
    - İkonların ilgili şirket sosyal hesaplarına yönlendirdiğini kontrol et (varsa)
  Gönderi (Post) Paylaşma:
    - Ana sayfada veya menüde "Yeni Gönderi" sayfasına git
    - Gönderi tipi olarak “İş İlanı” seç
    - Pozisyon ve şirket bilgilerini girerek bir iş ilanı oluştur
    - Gönderiyi paylaş ve ana akışta göründüğünü kontrol et
    - Başka bir kullanıcı hesabıyla giriş yap, o kullanıcı "İş Arıyorum" postu yarat
    - Anasayfada her iki gönderiyi de görebildiğini test et
  Admin Paneli:
    - Admin hesabıyla giriş yap
    - `/admin` sayfasını aç
    - Yeni eklenen “Gönderiler” sekmesine geç
    - Kullanıcı gönderilerini listeden sil ve sistemden kaldır
    - Duyurular sekmesine yeni duyuru ekle, görünürlüğünü ana sayfada test et
  Hata ve Güvenlik:
    - Giriş yapmadan `/profil` veya `/admin` sayfalarına gitmeye çalış
    - Uygun yetkisiz erişim uyarılarının (hata sayfası) gösterildiğini doğrula
}
```

Bu test akışı hem normal kullanıcı hem de admin senaryolarını kapsar ve yeni eklenen özelliklerin çalışmasını denetler. Gerekirse her adımda beklemeler, bildirim kontrolü ve veri temizleme adımları detaylandırılabilir.  

**Kaynaklar:** Mevcut proje dokümantasyonundaki sayfa yapısı ve veritabanı şemaları dikkate alınmıştır. Yeni özellik talepleri kullanıcı girdisinden türetilmiştir.