import Layout from "@/components/Layout";

const Legal = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Hukuki Bilgilendirme, KVKK, Sorumluluk Reddi ve Kullanım Esasları
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            İşbu metin, firmascope platformunun kullanımına ilişkin olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK"), 5651 sayılı Kanun, Türk Borçlar Kanunu, Türk Ceza Kanunu ve ilgili sair mevzuat hükümleri dikkate alınarak hazırlanmıştır.
          </p>

          <div className="mt-10 space-y-10">
            {/* Veri Sorumlusu */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Veri Sorumlusu ve İletişim Bilgileri</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope platformu kapsamında kişisel verileriniz, veri sorumlusu sıfatıyla Umut Barış Terzioğlu tarafından işlenmektedir. Veri sorumlusuna ait bilgiler şu şekildedir: Gutenbergstrasse 28, 44139 Dortmund, Almanya adresinde mukim Umut Barış Terzioğlu; e-posta adresi ubterzioglu@gmail.com; telefon numaraları +49 173 956 94 29 ve +90 530 240 49 95.
              </p>
            </div>

            {/* Kişisel Verilerin İşlenmesi */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Kişisel Verilerin İşlenmesi ve Amaçları</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Platformun kullanımı kapsamında kullanıcıya ait e-posta adresi, kullanıcı adı veya rumuz, platform içerisinde oluşturulan yorum ve değerlendirme içerikleri, IP adresi, log kayıtları, işlem tarih ve saat bilgileri ile çerez verileri işlenebilmektedir. Platformda gerçek ad, soyad, fotoğraf veya açık kimlik bilgisi paylaşılması zorunlu değildir.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Kişisel veriler; kullanıcı hesabının oluşturulması ve yönetilmesi, şirketler hakkında yorum ve değerlendirme yapılabilmesinin sağlanması, platform güvenliğinin temini, hukuki yükümlülüklerin yerine getirilmesi, yetkili kurum ve kuruluşların taleplerine cevap verilmesi ve olası hukuki uyuşmazlıklarda delil olarak kullanılabilmesi amaçlarıyla işlenmektedir. Veriler, KVKK'nın 5. maddesi uyarınca kanuni yükümlülükler, meşru menfaatler ve bir hakkın tesisi, kullanılması veya korunması hukuki sebeplerine dayalı olarak işlenmektedir.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Kişisel veriler, hukuki zorunluluklar dışında üçüncü kişilerle paylaşılmamakta olup yalnızca yetkili kamu kurum ve kuruluşları ile mahkemeler ve icra mercilerine yasal yükümlülükler kapsamında aktarılabilmektedir.
              </p>
            </div>

            {/* Veri Sahibi Hakları */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Veri Sahibi Hakları</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                KVKK'nın 11. maddesi uyarınca veri sahipleri; kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini talep etme ve kanuna aykırı işleme nedeniyle zarara uğramaları halinde tazminat talep etme haklarına sahiptir. Bu haklar, veri sorumlusuna yazılı olarak veya e-posta yoluyla iletilebilir.
              </p>
            </div>

            {/* Platformun Niteliği */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Platformun Niteliği ve Sorumluluk Reddi</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope platformu, kullanıcıların şirketler hakkındaki iş deneyimlerini paylaşabildiği bir içerik paylaşım platformudur. Platformda yer alan tüm yorumlar, değerlendirmeler ve puanlamalar tamamen kullanıcılar tarafından oluşturulmaktadır. Bu içerikler, firmascope'un görüşünü yansıtmaz ve doğrulukları, güncellikleri veya eksiksiz olmaları garanti edilmez.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope, hukuki anlamda yalnızca yer sağlayıcı sıfatıyla hizmet vermekte olup kullanıcılar tarafından paylaşılan içeriklerin ön incelemesini yapmaz. Platformda yer alan içeriklerden doğabilecek doğrudan veya dolaylı maddi ya da manevi zararlardan dolayı firmascope sorumlu tutulamaz.
              </p>
            </div>

            {/* İfade Özgürlüğü */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">İfade Özgürlüğü ve Eleştiri Hakkı</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Platform, kullanıcıların ifade özgürlüğü kapsamında iş deneyimlerini ve görüşlerini paylaşabilmeleri amacıyla faaliyet göstermektedir. Platformda yer alan yorum ve değerlendirmeler, kullanıcıların öznel görüşlerini yansıtır. İfade özgürlüğü; hakaret, iftira, tehdit, kişilik haklarının ihlali veya suç teşkil eden beyanları kapsamaz.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Bu sınırların aşılması hâlinde firmascope, ilgili içerikleri yayından kaldırma veya erişimi kısıtlama hakkını saklı tutar.
              </p>
            </div>

            {/* Kullanıcı Sorumluluğu */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Kullanıcı Beyanı ve Sorumluluğu</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Kullanıcılar, platform üzerinden paylaştıkları içeriklerin hakaret, iftira, küçük düşürücü ifade, suç isnadı veya kişisel veri ihlali içermediğini kabul ve beyan eder. Paylaşılan tüm içeriklerden doğan hukuki, cezai ve idari sorumluluk tamamen ilgili kullanıcıya aittir.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope, kullanıcıların paylaşımlarının doğruluğunu veya gerçeğe uygunluğunu doğrulama yükümlülüğü altında değildir ve bu içeriklerden dolayı herhangi bir sorumluluk kabul etmez.
              </p>
            </div>

            {/* Şirketlerle Bağımsızlık */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Şirketlerle Bağımsızlık</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope, platformda yer alan şirketler ile herhangi bir ticari, kurumsal veya hukuki ilişki içerisinde değildir. Şirket profilleri ve içerikler kullanıcı paylaşımlarına dayanmaktadır. Platformda yer alan hiçbir içerik, ilgili şirketler tarafından onaylanmış veya firmascope tarafından tavsiye edilmiş sayılmaz.
              </p>
            </div>

            {/* İçerik Kaldırma */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">İçerik Kaldırma ve Müdahale Hakkı</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope, hukuka aykırı olduğu değerlendirilen, şikâyete konu olan veya platformun amacına aykırı içerikleri geçici ya da kalıcı olarak yayından kaldırma, erişimi kısıtlama veya inceleme süresince dondurma hakkını saklı tutar. Bu işlemler herhangi bir bildirim veya gerekçe gösterme zorunluluğu olmaksızın gerçekleştirilebilir.
              </p>
            </div>

            {/* Amaç Dışı Kullanım */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Amaç Dışı Kullanım Yasağı</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Platform; karalama kampanyası yürütmek, organize şekilde itibar zedelemek, rakip firmaları hedef almak veya kötü niyetli toplu yorum faaliyetleri amacıyla kullanılamaz. Bu tür faaliyetlerin tespit edilmesi halinde ilgili hesaplar kalıcı olarak kapatılabilir.
              </p>
            </div>

            {/* Yetkili Mercilere Bilgi */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Yetkili Mercilere Bilgi Paylaşımı</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope, yetkili adli veya idari makamlar tarafından usulüne uygun şekilde talep edilmesi hâlinde kullanıcı bilgilerini ilgili mercilerle paylaşabilir. Bu paylaşım, yasal yükümlülüklerin yerine getirilmesi kapsamında yapılır.
              </p>
            </div>

            {/* Hukuki Uyuşmazlıklar */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Hukuki Uyuşmazlıklar ve Yetki</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope platformunun kullanımından doğabilecek tüm uyuşmazlıklarda Türk Hukuku uygulanır. Bu uyuşmazlıkların çözümünde Türkiye Cumhuriyeti mahkemeleri ve icra daireleri yetkilidir.
              </p>
            </div>

            {/* Değişiklik Hakkı */}
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Değişiklik Hakkı</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                firmascope, işbu metinde önceden bildirimde bulunmaksızın değişiklik yapma hakkını saklı tutar. Güncel metinler platform üzerinde yayımlandıkları tarihten itibaren geçerli kabul edilir.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
