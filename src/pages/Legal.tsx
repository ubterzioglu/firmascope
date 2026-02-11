import Layout from "@/components/Layout";

const sections = [
  {
    title: "Veri Sorumlusu",
    text: "Kişisel verileriniz, veri sorumlusu sıfatıyla Umut Barış Terzioğlu (Gutenbergstrasse 28, 44139 Dortmund, Almanya) tarafından işlenmektedir. İletişim: ubterzioglu@gmail.com",
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
    title: "Yetkili Mercilere Bilgi Paylaşımı",
    text: "Adli veya idari makamların usulüne uygun talepleri halinde kullanıcı bilgileri yasal yükümlülükler kapsamında paylaşılabilir.",
  },
  {
    title: "Uyuşmazlıklar",
    text: "Platformun kullanımından doğan uyuşmazlıklarda Türk Hukuku uygulanır, T.C. mahkemeleri ve icra daireleri yetkilidir.",
  },
  {
    title: "Değişiklik Hakkı",
    text: "firmascope bu metni önceden bildirimde bulunmaksızın değiştirebilir. Güncel metin yayımlandığı tarihten itibaren geçerlidir.",
  },
];

const Legal = () => {
  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="font-display text-lg font-bold text-foreground">
            Yasal Bilgiler
          </h1>
          <p className="mt-2 text-xs text-muted-foreground">
            KVKK, sorumluluk reddi ve kullanım esasları
          </p>

          <div className="mt-8 space-y-4">
            {sections.map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-4">
                <h2 className="font-display text-sm font-semibold text-foreground">{s.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
