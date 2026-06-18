// Static usage guides for every admin panel section.
// Rendered by src/pages/admin/AdminGuides.tsx as a searchable accordion.
// Content is derived from the actual behaviour of each admin page — keep it in
// sync when a section's workflow changes.

import {
  Megaphone, Lightbulb, FileCheck, Building2, Star, Banknote,
  UserCheck, Users, MessageSquare, Flag, Bot, Inbox, type LucideIcon,
} from "lucide-react";

export interface GuideSection {
  /** Route of the section this guide documents. */
  to: string;
  /** Section title, mirrors the nav label. */
  title: string;
  /** Icon, mirrors the nav icon. */
  icon: LucideIcon;
  /** One sentence: what this section is for. */
  purpose: string;
  /** Step-by-step usage. */
  howTo: string[];
  /** Rules, caveats and gotchas. Optional. */
  notes?: string[];
}

export const ADMIN_GUIDES: GuideSection[] = [
  {
    to: "/admin",
    title: "Duyurular",
    icon: Megaphone,
    purpose: "Sitenin üstünde gösterilen duyuru şeritlerini yönetir.",
    howTo: [
      "“Yeni Duyuru” ile başlık (zorunlu, en fazla 200 karakter), açıklama ve link URL girin.",
      "Link URL hem iç sayfa (`/sayfa`) hem dış adres (`https://...`) olabilir.",
      "“Sıra” alanı duyuruların gösterim sırasını belirler; küçük sayı önce gelir.",
      "“Aktif” anahtarı kapalıyken duyuru sitede görünmez; satırdaki anahtardan hızlıca aç/kapat yapabilirsiniz.",
      "Kalem ikonu ile düzenleyin, çöp kutusu ikonu ile silin.",
    ],
    notes: [
      "Pasif duyurular listede soluk gösterilir ama silinmez.",
      "Başlık 200, açıklama 500 karakter ile sınırlıdır.",
    ],
  },
  {
    to: "/admin/suggestions",
    title: "Öneriler",
    icon: Lightbulb,
    purpose: "Kullanıcıların önerdiği yeni şirketleri inceleyip onaylar veya reddeder.",
    howTo: [
      "Listede “Bekliyor” durumundaki önerileri inceleyin.",
      "“Şirket Oluştur” ile öneriyi doğrudan canonical şirkete dönüştürün; slug otomatik üretilir ve öneri onaylanmış sayılır.",
      "Uygun değilse çarpı (X) ikonu ile reddedin.",
    ],
    notes: [
      "Şirket oluşturma güvenli admin RPC üzerinden yapılır; kayıt `admin_manual` kaynak etiketiyle eklenir.",
      "Yalnızca “Bekliyor” durumundaki öneriler için işlem butonları görünür.",
    ],
  },
  {
    to: "/admin/claims",
    title: "Talepler",
    icon: FileCheck,
    purpose: "Bir kullanıcının bir şirketin yöneticiliğini üstlenme (claim) taleplerini onaylar.",
    howTo: [
      "Talep eden kullanıcının mesajını ve hedef şirketi inceleyin.",
      "Onay (✓) verdiğinizde kullanıcıya `company_admin` rolü atanır ve ilgili şirkete yönetici olarak bağlanır.",
      "Uygun değilse çarpı (X) ile reddedin.",
    ],
    notes: [
      "Onay; `user_roles` ve `company_admins` tablolarına kayıt ekler (varsa günceller).",
      "İşlem butonları yalnızca “Bekliyor” durumundaki taleplerde görünür.",
    ],
  },
  {
    to: "/admin/companies",
    title: "Şirketler",
    icon: Building2,
    purpose: "Şirket kayıtlarını oluşturur, düzenler ve toplu SQL ile içe aktarır.",
    howTo: [
      "Tek şirket için “SQL Destekli Şirket Ekle” ile formu açın; Ad ve Slug zorunludur (slug ad’dan otomatik üretilir).",
      "Logo/banner’ı URL ile ya da dosya yükleyerek ekleyebilirsiniz; sosyal medya linkleri opsiyoneldir.",
      "Toplu ekleme için “SQL Dosyası Yükle” alanından `.sql` dosyanızı seçip “SQL Dosyasını Çalıştır” deyin; sonuç (eklenen/atlanan/hatalar) ekranda özetlenir.",
      "Mevcut bir kaydı düzenlemek için satırdaki kalem ikonunu kullanın.",
    ],
    notes: [
      "Yeni kayıtlar güvenli `create_company_admin` RPC ile oluşturulur; aynı slug varsa kayıt yapılmaz (duplicate koruması).",
      "Eski 101 legacy kayıt `before` etiketiyle korunur; tabloda her kaydın Kaynak ve Ekleyen Admin bilgisi gösterilir.",
      "Sadece `.sql` uzantılı dosyalar kabul edilir.",
    ],
  },
  {
    to: "/admin/reviews",
    title: "Yorumlar",
    icon: Star,
    purpose: "Kullanıcı şirket yorumlarını düzenler veya siler.",
    howTo: [
      "Kalem ikonu ile yorumu açıp başlık, olumlu/olumsuz yönler, genel puan (1-5) ve tavsiye durumunu düzenleyin.",
      "İlişki tipi, pozisyon seviyesi, çalışma modeli gibi alanları açılır menülerden seçin.",
      "8 detay puanını (çalışma ortamı, iletişim, iş-hayat dengesi vb.) ve yan hakları işaretleyin.",
      "Uygunsuz yorumu çöp kutusu ikonu ile kalıcı olarak silin.",
    ],
    notes: [
      "Başlık zorunludur.",
      "Detay puanı 0 bırakılırsa o kriter boş (null) kaydedilir.",
      "Silme işlemi geri alınamaz.",
    ],
  },
  {
    to: "/admin/salaries",
    title: "Maaşlar",
    icon: Banknote,
    purpose: "Paylaşılan maaş bilgilerini düzenler veya siler.",
    howTo: [
      "Kalem ikonu ile pozisyon, maaş tutarı ve para birimini düzenleyin (her ikisi zorunludur).",
      "Net/Brüt, çalışma tipi, seniority, çalışma modeli gibi alanları açılır menülerden seçin.",
      "Deneyim yılı, yıllık bonus, hisse/equity ve yan hakları ekleyin.",
      "Uygunsuz kaydı çöp kutusu ikonu ile silin.",
    ],
    notes: [
      "Pozisyon ve maaş tutarı boş olamaz.",
      "Tutar tabloda binlik ayraçla ve para birimiyle gösterilir.",
    ],
  },
  {
    to: "/admin/interviews",
    title: "Mülakatlar",
    icon: UserCheck,
    purpose: "Mülakat deneyimi paylaşımlarını düzenler veya siler.",
    howTo: [
      "Kalem ikonu ile pozisyon (zorunlu), deneyim metni, zorluk ve sonuç alanlarını düzenleyin.",
      "Mülakat yılı, türü, aşama sayısı, geri dönüş süresi gibi detayları girin.",
      "“Case Study var” ve “Maaş konuşuldu” kutularını işaretleyebilirsiniz.",
      "Sonuç “Teklif Aldım” seçilirse teklif edilen maaş ve para birimi alanları görünür.",
    ],
    notes: [
      "Pozisyon zorunludur.",
      "Teklif maaşı yalnızca sonuç “Teklif Aldım” iken kaydedilir; aksi halde boş bırakılır.",
    ],
  },
  {
    to: "/admin/users",
    title: "Kullanıcılar",
    icon: Users,
    purpose: "Kayıtlı kullanıcıları listeler ve admin rolü atar/kaldırır.",
    howTo: [
      "Listede her kullanıcının rolünü (user / company_admin / admin) görün.",
      "Bir kullanıcıyı admin yapmak için “Admin Yap”, rolü almak için “Admin Kaldır” butonunu kullanın.",
    ],
    notes: [
      "Admin ekleme/çıkarma yetkisi YALNIZCA super admin hesabında açıktır: ubterzioglu@gmail.com.",
      "Kullanıcının önce siteye kayıt olmuş olması gerekir; aksi halde rol kaydı bağlanamaz.",
      "Diğer adminler bu sayfayı görür ama rol değiştiremez (“Sadece super admin” uyarısı çıkar).",
    ],
  },
  {
    to: "/admin/posts",
    title: "Gönderiler",
    icon: MessageSquare,
    purpose: "Akıştaki kullanıcı gönderilerini denetler ve uygunsuz olanları siler.",
    howTo: [
      "Gönderinin yazarını, içeriğini, tipini (Düz Mesaj / İş İlanı / İş Arıyorum) ve şirketini inceleyin.",
      "Uygunsuz gönderiyi çöp kutusu ikonu ile silin.",
    ],
    notes: [
      "Bu bölüm denetim odaklıdır; gönderi düzenleme yoktur, yalnızca silme yapılır.",
      "Silme işlemi geri alınamaz.",
    ],
  },
  {
    to: "/admin/reports",
    title: "Raporlar",
    icon: Flag,
    purpose: "Kullanıcıların raporladığı içerikleri (yorum/maaş/mülakat/gönderi) inceler ve karara bağlar.",
    howTo: [
      "Üstte bekleyen rapor sayısı uyarısı gösterilir.",
      "Göz (👁) ikonu ile rapor detayını açın; sebep, detay ve admin notunu görüp/düzenleyin.",
      "Hızlı işlem için satırdaki ✓ (Çözüldü) veya X (Reddet) butonlarını kullanın.",
      "Detay penceresinde “İçeriği Sil & Çöz” raporlanan asıl içeriği siler ve raporu çözülmüş işaretler.",
    ],
    notes: [
      "“İçeriği Sil & Çöz” hedef içeriği (yorum/maaş/mülakat) kalıcı olarak siler — dikkatli kullanın.",
      "İşlem butonları yalnızca “Bekliyor” durumundaki raporlarda görünür.",
    ],
  },
  {
    to: "/admin/scrape",
    title: "Scrape İşleri",
    icon: Bot,
    purpose: "Harici worker tarafından çalıştırılan şirket toplama (scrape) işlerini başlatır ve izler.",
    howTo: [
      "“Yeni İş” ile bir kaynak adı ve her satıra bir tane olacak şekilde seed URL’ler girin.",
      "İş kuyruğa eklenir ve harici worker tarafından çalıştırılır; liste otomatik yenilenir.",
      "“Detay” ile bir işin durumunu, istatistiklerini ve canlı loglarını görün.",
      "Çalışan veya kuyruktaki bir işi detay sayfasından “İşi İptal Et” ile durdurabilirsiniz.",
    ],
    notes: [
      "Kaynak ve en az bir seed URL zorunludur.",
      "Scrape sonuçları doğrudan yayına geçmez; onay için “İçe Aktarımlar” kuyruğunda bekler.",
      "İptal isteği worker bir sonraki kontrolünde devreye girer.",
    ],
  },
  {
    to: "/admin/imports",
    title: "İçe Aktarımlar",
    icon: Inbox,
    purpose: "Scrape sonucu gelen şirket adaylarını onaylayarak canonical listeye ekler.",
    howTo: [
      "Bekleyen aday kayıtlarını (ad, slug, sektör, şehir, kaynak) inceleyin.",
      "“Dedupe” sütunu kaydın yeni mi yoksa mevcut bir şirketle mi eşleştiğini gösterir.",
      "Onay (✓) ile kaydı `companies` tablosuna ekleyin; reddetmek için çarpı (X) kullanın.",
    ],
    notes: [
      "Hiçbir kayıt onay olmadan yayına geçmez.",
      "Onayladığınız kayıt mevcut bir slug ile eşleşirse yeni şirket oluşturulmaz, kayıt mevcutla eşleştirilir.",
      "Liste otomatik yenilenir.",
    ],
  },
];
