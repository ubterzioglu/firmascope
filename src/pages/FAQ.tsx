import Layout from "@/components/Layout";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { q: "Firmascope nedir?", a: "Firmascope, Türkiye'de çalışanların ve eski çalışanların şirket deneyimlerini anonim olarak paylaşabildiği bir platformdur. Maaş bilgileri, mülakat deneyimleri ve şirket kültürü hakkında gerçek veriler sunar." },
  { q: "Kimliğim gerçekten gizli mi?", a: "Evet. Kayıt olduğunuzda sadece e-posta ve takma ad bilgisi alınır. Gerçek isminiz, profil fotoğrafınız veya sosyal bilgileriniz asla görünmez." },
  { q: "Maaş bilgilerini nasıl görebilirim?", a: "Maaş verilerini görmek için önce kendi maaş bilginizi anonim olarak paylaşmanız gerekir (give-to-get modeli)." },
  { q: "Şirketler yorumları silebilir mi?", a: "Hayır. Şirketler tekil yorumları silemez veya yanıtlayamaz. Sadece genel bir açıklama yayınlayabilirler." },
  { q: "Verilerim KVKK'ya uygun mu?", a: "Evet. Minimum veri toplama ilkesiyle çalışıyoruz. Hesabınızı istediğiniz zaman silebilirsiniz." },
  { q: "Nasıl yorum yazabilirim?", a: "Ücretsiz kaydolduktan ve takma adınızı seçtikten sonra istediğiniz şirkete yorum yazabilirsiniz." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4">
          <h1 className="font-display text-4xl font-bold text-foreground">Sıkça Sorulan Sorular</h1>
          <p className="mt-3 text-muted-foreground">Merak ettiklerinize hızlıca cevap bulun</p>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-display text-sm font-semibold text-foreground">{faq.q}</span>
                  {open === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </button>
                {open === i && (
                  <div className="border-t border-border px-5 pb-5 pt-3">
                    <p className="text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
