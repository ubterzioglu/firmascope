export type StaticPageSection = {
  title: string;
  text: string;
};

export type StaticPageContent = {
  /** Footer'da görünen kısa etiket */
  label: string;
  /** Sayfa başlığı (h1) */
  title: string;
  /** SEO title (titleSuffix eklenir) */
  metaTitle: string;
  metaDescription: string;
  path: string;
  /** Başlık altındaki kısa açıklama */
  subtitle: string;
  /** Kartlardan önce gelen serbest giriş paragrafı (opsiyonel) */
  intro?: string;
  sections: StaticPageSection[];
};

const DATA_CONTROLLER =
  "Umut Barış Terzioğlu (Gutenbergstrasse 28, 44139 Dortmund, Almanya)";
const CONTACT_EMAIL = "ubterzioglu@gmail.com";

export const about: StaticPageContent = {
  label: "Hakkımızda",
  title: "Hakkımızda",
  metaTitle: "Hakkımızda",
  metaDescription:
    "firmascope, çalışanların şirketleri anonim olarak değerlendirdiği bağımsız bir platformdur. Misyonumuzu ve nasıl çalıştığımızı keşfedin.",
  path: "/hakkimizda",
  subtitle: "firmascope nedir, neden var",
  intro:
    "firmascope, Türkiye'deki şirketleri çalışanların gözünden şeffaf hale getirmek için kurulmuş bağımsız bir değerlendirme platformudur. İş arayanların doğru kararlar verebilmesi için maaş, mülakat ve şirket kültürü bilgilerini tek bir yerde topluyoruz.",
  sections: [
    {
      title: "Misyonumuz",
      text: "İş hayatında bilgi dengesizliğini azaltmayı hedefliyoruz. Şirketler adaylar hakkında detaylı bilgiye sahipken, adaylar çoğu zaman karanlıkta kalıyor. firmascope bu dengeyi gerçek çalışan deneyimleriyle tersine çevirir.",
    },
    {
      title: "Nasıl Çalışır",
      text: "Çalışanlar ve eski çalışanlar, kimlikleri ifşa olmadan şirketlerine dair değerlendirme, maaş ve mülakat deneyimi paylaşır. Paylaşımlar topluluk tarafından okunur ve iş arayanlara karar verme aşamasında yol gösterir.",
    },
    {
      title: "Anonimlik İlkesi",
      text: "Katkıların samimi olması için anonimliği önemsiyoruz. Değerlendirmeler kişisel kimlik bilgisi içermeden yayımlanır; amaç bireyleri değil, iş yerlerine dair genel resmi ortaya koymaktır.",
    },
    {
      title: "Bağımsızlık",
      text: "firmascope, platformda yer alan şirketlerle ticari veya hukuki bir ilişki içinde değildir. İçerikler tamamen kullanıcı paylaşımlarına dayanır ve şirketler tarafından onaylanmış sayılmaz.",
    },
  ],
};

export const contact: StaticPageContent = {
  label: "İletişim",
  title: "İletişim",
  metaTitle: "İletişim",
  metaDescription:
    "firmascope ile iletişime geçin. Soru, öneri, içerik bildirimi ve veri talepleriniz için iletişim bilgilerimiz.",
  path: "/iletisim",
  subtitle: "Bize nasıl ulaşırsınız",
  intro:
    "Soru, öneri, hata bildirimi veya kişisel verilerinize ilişkin talepleriniz için bize aşağıdaki kanaldan ulaşabilirsiniz. Gelen mesajlara makul süre içinde yanıt vermeye çalışıyoruz.",
  sections: [
    {
      title: "E-posta",
      text: `Her türlü talep için: ${CONTACT_EMAIL}`,
    },
    {
      title: "Veri Sorumlusu",
      text: `Kişisel verilerinize ilişkin talepleriniz, veri sorumlusu sıfatıyla ${DATA_CONTROLLER} tarafından değerlendirilir. İletişim: ${CONTACT_EMAIL}`,
    },
    {
      title: "İçerik Bildirimi",
      text: "Hukuka aykırı, yanıltıcı veya kişilik haklarını ihlal eden bir içerikle karşılaşırsanız, ilgili sayfayı belirterek e-posta yoluyla bildirebilirsiniz. Bildirimler değerlendirilerek gereken işlem yapılır.",
    },
  ],
};

export const careers: StaticPageContent = {
  label: "Kariyer",
  title: "Kariyer",
  metaTitle: "Kariyer",
  metaDescription:
    "firmascope ekibine katılmak ister misiniz? Açık pozisyonlar ve başvuru süreci hakkında bilgi alın.",
  path: "/kariyer",
  subtitle: "firmascope'ta çalışmak",
  intro:
    "firmascope küçük ve odaklı bir ekiple yürütülen bağımsız bir projedir. Şu anda açık bir pozisyonumuz bulunmuyor; ancak ürüne, içeriğe veya teknolojiye katkı sunmak isteyen, işin şeffaflığına inanan kişilerle tanışmaktan memnuniyet duyarız.",
  sections: [
    {
      title: "Açık Pozisyonlar",
      text: "Şu an için aktif bir ilanımız yok. İlerleyen dönemde açılacak roller bu sayfada duyurulacaktır.",
    },
    {
      title: "Spontane Başvuru",
      text: `Yetenek ve ilgi alanlarınızın projeye katkı sağlayabileceğini düşünüyorsanız, kısa bir tanıtım ve örnek çalışmalarınızla ${CONTACT_EMAIL} adresine yazabilirsiniz.`,
    },
  ],
};

export const privacyPolicy: StaticPageContent = {
  label: "Gizlilik Politikası",
  title: "Gizlilik Politikası",
  metaTitle: "Gizlilik Politikası",
  metaDescription:
    "firmascope kişisel verilerinizi nasıl işler ve korur? Veri sorumlusu, işleme amaçları ve haklarınız hakkında bilgilendirme.",
  path: "/gizlilik-politikasi",
  subtitle: "Verilerinizi nasıl koruyoruz",
  sections: [
    {
      title: "Veri Sorumlusu",
      text: `Kişisel verileriniz, veri sorumlusu sıfatıyla ${DATA_CONTROLLER} tarafından işlenmektedir. İletişim: ${CONTACT_EMAIL}`,
    },
    {
      title: "Kişisel Verilerin İşlenmesi",
      text: "E-posta, kullanıcı adı, IP adresi ve log kayıtları; hesap yönetimi, platform güvenliği ve yasal yükümlülükler kapsamında KVKK m.5 uyarınca işlenir. Veriler yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz.",
    },
    {
      title: "Veri Sahibi Hakları",
      text: "KVKK m.11 kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini, silinmesini talep etme ve kanuna aykırı işleme nedeniyle tazminat isteme haklarınız mevcuttur.",
    },
    {
      title: "Saklama Süresi",
      text: "Veriler, işleme amacının gerektirdiği ve ilgili mevzuatın öngördüğü süreler boyunca saklanır; bu sürelerin sonunda silinir, yok edilir veya anonim hale getirilir.",
    },
  ],
};

export const termsOfUse: StaticPageContent = {
  label: "Kullanım Şartları",
  title: "Kullanım Şartları",
  metaTitle: "Kullanım Şartları",
  metaDescription:
    "firmascope kullanım koşulları: sorumluluk reddi, içerik kuralları, kullanıcı yükümlülükleri ve uyuşmazlıkların çözümü.",
  path: "/kullanim-sartlari",
  subtitle: "Platform kullanım esasları",
  sections: [
    {
      title: "Sorumluluk Reddi",
      text: "firmascope yer sağlayıcı sıfatıyla hizmet verir. İçerikler kullanıcılara aittir, ön inceleme yapılmaz. İçeriklerin doğruluğu garanti edilmez; doğabilecek zararlardan firmascope sorumlu tutulamaz.",
    },
    {
      title: "İfade Özgürlüğü",
      text: "Kullanıcılar iş deneyimlerini özgürce paylaşabilir. Ancak hakaret, iftira, tehdit veya kişilik haklarını ihlal eden içerikler kapsam dışıdır ve kaldırılabilir.",
    },
    {
      title: "Kullanıcı Sorumluluğu",
      text: "Paylaşılan içeriklerdeki hukuki, cezai ve idari sorumluluk tamamen kullanıcıya aittir. firmascope içeriklerin doğruluğunu teyit etme yükümlülüğü altında değildir.",
    },
    {
      title: "Şirketlerle Bağımsızlık",
      text: "firmascope, platformdaki şirketlerle ticari veya hukuki ilişki içinde değildir. İçerikler kullanıcı paylaşımlarına dayanır, şirketler tarafından onaylanmış sayılmaz.",
    },
    {
      title: "İçerik Kaldırma Hakkı",
      text: "Hukuka aykırı veya platformun amacına aykırı içerikler bildirim olmaksızın kaldırılabilir veya erişimi kısıtlanabilir.",
    },
    {
      title: "Amaç Dışı Kullanım Yasağı",
      text: "Karalama kampanyası, organize itibar zedeleme veya kötü niyetli toplu yorum faaliyetleri yasaktır. Tespit halinde hesaplar kalıcı olarak kapatılır.",
    },
    {
      title: "Uyuşmazlıklar",
      text: "Platformun kullanımından doğan uyuşmazlıklarda Türk Hukuku uygulanır, T.C. mahkemeleri ve icra daireleri yetkilidir.",
    },
    {
      title: "Değişiklik Hakkı",
      text: "firmascope bu metni önceden bildirimde bulunmaksızın değiştirebilir. Güncel metin yayımlandığı tarihten itibaren geçerlidir.",
    },
  ],
};

export const kvkk: StaticPageContent = {
  label: "KVKK / GDPR / CCPA",
  title: "KVKK / GDPR / CCPA",
  metaTitle: "KVKK / GDPR / CCPA Aydınlatma Metni",
  metaDescription:
    "firmascope veri koruma uyumu: KVKK kapsamındaki haklarınız ve GDPR / CCPA altındaki eşdeğer veri sahibi hakları.",
  path: "/kvkk-gdpr-ccpa",
  subtitle: "Veri koruma haklarınız",
  intro:
    "Bulunduğunuz hukuki bölgeye göre kişisel verilerinize ilişkin haklarınız değişebilir. Aşağıda KVKK (Türkiye), GDPR (Avrupa Birliği) ve CCPA (Kaliforniya) kapsamındaki temel haklara dair özet bilgi yer alır.",
  sections: [
    {
      title: "KVKK Kapsamındaki Haklar",
      text: "6698 sayılı KVKK m.11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, düzeltme, silme veya yok edilmesini isteme ve kanuna aykırı işleme nedeniyle zararın giderilmesini talep etme haklarına sahipsiniz.",
    },
    {
      title: "GDPR Kapsamındaki Haklar",
      text: "Avrupa Birliği'nde ikamet ediyorsanız GDPR uyarınca erişim (Art. 15), düzeltme (Art. 16), silme/unutulma (Art. 17), işlemeyi kısıtlama (Art. 18), veri taşınabilirliği (Art. 20) ve itiraz (Art. 21) haklarına sahipsiniz.",
    },
    {
      title: "CCPA Kapsamındaki Haklar",
      text: "Kaliforniya sakinleri CCPA uyarınca hangi kişisel bilgilerin toplandığını öğrenme, bu bilgilerin silinmesini talep etme ve kişisel bilgilerin satışını reddetme (opt-out) haklarına sahiptir. firmascope kişisel bilgileri satmaz.",
    },
    {
      title: "Haklarınızı Kullanma",
      text: `Yukarıdaki haklardan herhangi birini kullanmak için ${CONTACT_EMAIL} adresine başvurabilirsiniz. Talebiniz, ilgili mevzuatın öngördüğü süre içinde değerlendirilir.`,
    },
  ],
};

export const cookiePolicy: StaticPageContent = {
  label: "Çerez Politikası",
  title: "Çerez Politikası",
  metaTitle: "Çerez Politikası",
  metaDescription:
    "firmascope hangi çerezleri neden kullanır? Analiz çerezleri, onay yönetimi ve çerez tercihlerinizi nasıl kontrol edebileceğiniz.",
  path: "/cerez-politikasi",
  subtitle: "Çerezleri nasıl kullanıyoruz",
  intro:
    "firmascope, deneyiminizi iyileştirmek ve platformun nasıl kullanıldığını anlamak için çerezlerden yararlanabilir. Bu sayfa hangi çerezleri neden kullandığımızı ve tercihlerinizi nasıl yönetebileceğinizi açıklar.",
  sections: [
    {
      title: "Zorunlu Çerezler",
      text: "Oturum yönetimi ve temel güvenlik gibi platformun çalışması için gerekli çerezlerdir. Bu çerezler olmadan site düzgün işlemez ve devre dışı bırakılamaz.",
    },
    {
      title: "Analiz Çerezleri",
      text: "Deneyimi iyileştirmek ve kullanım akışını anlamak için analiz çerezleri kullanabiliriz. Bu çerezler, ziyaretçi davranışını toplu ve anonim şekilde ölçmemize yardımcı olur.",
    },
    {
      title: "Onay Yönetimi",
      text: "Siteyi ilk ziyaretinizde çerez kullanımı için onayınızı sorarız. Onayınızı dilediğiniz zaman tarayıcınızın çerez ayarlarından geri çekebilir veya değiştirebilirsiniz.",
    },
    {
      title: "Çerezleri Kontrol Etme",
      text: "Tarayıcınızın ayarları üzerinden çerezleri silebilir veya engelleyebilirsiniz. Bazı çerezlerin devre dışı bırakılması, platformun bazı özelliklerinin beklendiği gibi çalışmamasına yol açabilir.",
    },
  ],
};

/** Footer'da soldan sağa görünecek sayfa sırası */
export const FOOTER_PAGES: StaticPageContent[] = [
  about,
  contact,
  careers,
  privacyPolicy,
  termsOfUse,
  kvkk,
  cookiePolicy,
];

/** sitemap / indexable route üretimi için yolların listesi */
export const FOOTER_PAGE_PATHS = FOOTER_PAGES.map((page) => page.path);
