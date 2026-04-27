export type HomepageFaqItem = {
  question: string;
  answer: string;
  color: string;
};

export const homepageFaqItems: HomepageFaqItem[] = [
  {
    question: "firmascope nasıl çalışır?",
    answer:
      "firmascope, çalışanların şirket deneyimlerini anonim olarak paylaştığı bir platformdur. Değerlendirme, maaş ve mülakat bilgilerini güvenle paylaşabilirsiniz.",
    color: "text-alm-blue",
  },
  {
    question: "Kimliğim gerçekten gizli mi kalıyor?",
    answer:
      "Evet, yüzde 100 anonim. IP adresi, e-posta veya kişisel bilgiler asla şirketlerle paylaşılmaz. Gelişmiş şifreleme ile verileriniz korunur.",
    color: "text-alm-green",
  },
  {
    question: "Şirket değerlendirmesi nasıl yapılır?",
    answer:
      "Bir şirket sayfasına gidip 'Değerlendirme Yaz' butonuna tıklayın. Artıları, eksileri ve puanınızı paylaşın. Tamamen anonim kalırsınız.",
    color: "text-alm-orange",
  },
  {
    question: "Maaş bilgileri nasıl paylaşılır?",
    answer:
      "Çalıştığınız şirketin sayfasında 'Maaş Bilgisi Ekle' butonunu kullanın. Pozisyon, deneyim yılı ve maaş tutarını girin.",
    color: "text-alm-yellow",
  },
  {
    question: "Mülakat deneyimi nedir?",
    answer:
      "Başvurduğunuz şirketin mülakat sürecini, zorluk derecesini ve sonucunu paylaşarak diğer adaylara yol gösterirsiniz.",
    color: "text-alm-blue",
  },
  {
    question: "Şirketler yorumları silebilir mi?",
    answer:
      "Hayır. Şirketlerin yorumları silme veya düzenleme yetkisi yoktur. Tüm içerikler bağımsız olarak yönetilir.",
    color: "text-alm-green",
  },
  {
    question: "Sahte yorumları nasıl engelliyorsunuz?",
    answer:
      "Gelişmiş doğrulama sistemimiz ve topluluk moderasyonu ile sahte içerikleri tespit edip kaldırıyoruz.",
    color: "text-alm-orange",
  },
  {
    question: "firmascope ücretsiz mi?",
    answer:
      "Evet, firmascope tamamen ücretsiz bir platformdur. Değerlendirme okuma, maaş bilgisi görüntüleme ve paylaşım yapmak için herhangi bir ücret alınmaz.",
    color: "text-alm-yellow",
  },
];
