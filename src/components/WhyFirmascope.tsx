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
    question: "firmascope nasil calisir?",
    answer:
      "firmascope, calisanlarin sirket deneyimlerini anonim olarak paylastigi bir platformdur. Degerlendirme, maas ve mulakat bilgilerini guvenle paylasabilirsiniz.",
    color: "text-alm-blue",
  },
  {
    question: "Kimligim gercekten gizli mi kaliyor?",
    answer:
      "Evet, yuzde 100 anonim. IP adresi, e-posta veya kisisel bilgiler asla sirketlerle paylasilmaz. Gelismis sifreleme ile verileriniz korunur.",
    color: "text-alm-green",
  },
  {
    question: "Sirket degerlendirmesi nasil yapilir?",
    answer:
      "Bir sirket sayfasina gidip 'Degerlendirme Yaz' butonuna tiklayin. Artilari, eksileri ve puaninizi paylasin. Tamamen anonim kalirsiniz.",
    color: "text-alm-orange",
  },
  {
    question: "Maas bilgileri nasil paylasilir?",
    answer:
      "Calistiginiz sirketin sayfasinda 'Maas Bilgisi Ekle' butonunu kullanin. Pozisyon, deneyim yili ve maas tutarini girin.",
    color: "text-alm-yellow",
  },
  {
    question: "Mulakat deneyimi nedir?",
    answer:
      "Basvurdugunuz sirketin mulakat surecini, zorluk derecesini ve sonucunu paylasarak diger adaylara yol gosterirsiniz.",
    color: "text-alm-blue",
  },
  {
    question: "Sirketler yorumlari silebilir mi?",
    answer:
      "Hayir. Sirketlerin yorumlari silme veya duzenleme yetkisi yoktur. Tum icerikler bagimsiz olarak yonetilir.",
    color: "text-alm-green",
  },
  {
    question: "Sahte yorumlari nasil engelliyorsunuz?",
    answer:
      "Gelismis dogrulama sistemimiz ve topluluk moderasyonu ile sahte icerikleri tespit edip kaldiriyoruz.",
    color: "text-alm-orange",
  },
  {
    question: "firmascope ucretsiz mi?",
    answer:
      "Evet, firmascope tamamen ucretsiz bir platformdur. Degerlendirme okuma, maas bilgisi goruntuleme ve paylasim yapmak icin herhangi bir ucret alinmaz.",
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
            Sik Sorulan Sorular
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
                      Daha fazla bilgi icin <Link to="/sirketler" className="font-semibold text-primary hover:underline">Sirketler</Link> sayfasina bakabilirsiniz.
                    </>
                  )}
                  {index === 7 && (
                    <>
                      {" "}
                      Yeni sirket eklemek icin <Link to="/sirket-oner" className="font-semibold text-primary hover:underline">Sirket Oner</Link> sayfasini kullanabilirsiniz.
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
