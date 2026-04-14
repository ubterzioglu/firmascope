import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import JsonLd from "@/components/JsonLd";
import { generateJsonLd } from "@/lib/seo";

type FaqItem = {
  question: string;
  answer: string;
  color: string;
};

const faqItems: FaqItem[] = [
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

const faqSchema = generateJsonLd.faq(
  faqItems.map((item) => ({ question: item.question, answer: item.answer }))
);

const WhyFirmascope = () => {
  return (
    <section id="faq" className="relative z-10 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-lg md:p-10">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground md:text-3xl">
            Sık Sorulan Sorular
          </h2>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border">
                <AccordionTrigger
                  className={`font-display text-sm font-semibold ${item.color} hover:no-underline md:text-base`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                  {(index === 0 || index === 3) && (
                    <>
                      {" "}
                      Daha fazla bilgi için <Link to="/sirketler" className="font-semibold text-primary hover:underline">Şirketler</Link> sayfasına bakabilirsiniz.
                    </>
                  )}
                  {index === 7 && (
                    <>
                      {" "}
                      Yeni şirket eklemek için <Link to="/sirket-oner" className="font-semibold text-primary hover:underline">Şirket Öner</Link> sayfasını kullanabilirsiniz.
                    </>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <JsonLd data={faqSchema} />
    </section>
  );
};

export default WhyFirmascope;
