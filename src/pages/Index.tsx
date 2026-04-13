import Layout from "@/components/Layout";
import FloatingDot from "@/components/FloatingDot";
import AnnouncementCarousel from "@/components/AnnouncementCarousel";
import WhySection from "@/components/WhySection";
import WhyFirmascope from "@/components/WhyFirmascope";
import JsonLd from "@/components/JsonLd";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Lightbulb, Star, Users, DollarSign, UserPlus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { generateJsonLd, generateMeta, seoConfig } from "@/lib/seo";

const actionItems = [
  { label: "Sirket Ara", icon: Search, color: "bg-alm-blue", href: "/sirketler" },
  { label: "Sirket Oner", icon: Lightbulb, color: "bg-alm-green", href: "/sirket-oner" },
  { label: "Sirket Degerlendirmesi Ekle", icon: Star, color: "bg-alm-orange", href: "/sirketler" },
  { label: "Mulakat Bilgisi Ekle", icon: Users, color: "bg-alm-yellow", href: "/sirketler" },
  { label: "Maas Bilgisi Ekle", icon: DollarSign, color: "bg-alm-teal", href: "/sirketler" },
  { label: "Uye Ol", icon: UserPlus, color: "bg-alm-red", href: "/giris" },
];

const homepageFaqItems = [
  {
    question: "firmascope nasil calisir?",
    answer:
      "firmascope, calisanlarin sirket deneyimlerini anonim olarak paylastigi bir platformdur. Degerlendirme, maas ve mulakat bilgilerini guvenle paylasabilirsiniz.",
  },
  {
    question: "Kimligim gercekten gizli mi kaliyor?",
    answer:
      "Evet, yuzde 100 anonim. IP adresi, e-posta veya kisisel bilgiler asla sirketlerle paylasilmaz. Gelismis sifreleme ile verileriniz korunur.",
  },
  {
    question: "Sirket degerlendirmesi nasil yapilir?",
    answer:
      "Bir sirket sayfasina gidip Degerlendirme Yaz butonuna tiklayin. Artilari, eksileri ve puaninizi paylasin. Tamamen anonim kalirsiniz.",
  },
  {
    question: "Maas bilgileri nasil paylasilir?",
    answer:
      "Calistiginiz sirketin sayfasinda Maas Bilgisi Ekle butonunu kullanin. Pozisyon, deneyim yili ve maas tutarini girin.",
  },
  {
    question: "Mulakat deneyimi nedir?",
    answer:
      "Basvurdugunuz sirketin mulakat surecini, zorluk derecesini ve sonucunu paylasarak diger adaylara yol gosterirsiniz.",
  },
  {
    question: "Sirketler yorumlari silebilir mi?",
    answer:
      "Hayir. Sirketlerin yorumlari silme veya duzenleme yetkisi yoktur. Tum icerikler bagimsiz olarak yonetilir.",
  },
  {
    question: "Sahte yorumlari nasil engelliyorsunuz?",
    answer:
      "Gelismis dogrulama sistemimiz ve topluluk moderasyonu ile sahte icerikleri tespit edip kaldiriyoruz.",
  },
  {
    question: "firmascope ucretsiz mi?",
    answer:
      "Evet, firmascope tamamen ucretsiz bir platformdur. Degerlendirme okuma, maas bilgisi goruntuleme ve paylasim yapmak icin herhangi bir ucret alinmaz.",
  },
];

const Index = () => {
  const [expanded, setExpanded] = useState(false);

  const meta = generateMeta({
    title: "Turkiye'nin anonim sirket degerlendirme platformu",
    description:
      "firmascope, Turkiye'deki sirketleri anonim olarak degerlendirmenizi saglayan platformdur. Gercek calisan deneyimleri, maas bilgisi ve mulakat sureclerini guvenle paylasabilirsiniz.",
    path: "/",
    keywords: [
      "anonim sirket degerlendirme",
      "maas bilgisi",
      "mulakat deneyimi",
      "Turkiye sirket yorumlari",
    ],
  });

  const organizationJsonLd = generateJsonLd.organization([
    "https://www.linkedin.com",
    "https://x.com",
    "https://www.youtube.com",
  ]);
  const websiteJsonLd = generateJsonLd.website();
  const faqJsonLd = generateJsonLd.faq(homepageFaqItems);
  const webPageJsonLd = generateJsonLd.webPage({
    type: "CollectionPage",
    name: meta.title,
    description: meta.description,
    path: "/",
    datePublished: "2025-01-01",
    dateModified: "2026-04-13",
    speakableSelectors: [".speakable-summary", ".direct-answer"],
  });
  const breadcrumbJsonLd = generateJsonLd.breadcrumb([
    { name: "Ana Sayfa", item: `${seoConfig.siteUrl}/` },
  ]);

  return (
    <Layout>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="robots" content={meta.robots} />
        {meta.keywords && <meta name="keywords" content={meta.keywords} />}
        <link rel="canonical" href={meta.canonical} />

        <meta property="og:title" content={meta.openGraph.title} />
        <meta property="og:description" content={meta.openGraph.description} />
        <meta property="og:type" content={meta.openGraph.type} />
        <meta property="og:url" content={meta.openGraph.url} />
        <meta property="og:image" content={meta.openGraph.image} />

        <meta name="twitter:card" content={meta.twitter.card} />
        <meta name="twitter:title" content={meta.twitter.title} />
        <meta name="twitter:description" content={meta.twitter.description} />
        <meta name="twitter:image" content={meta.twitter.image} />
      </Helmet>

      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={webPageJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <FloatingDot className="left-[8%] top-[12%]" size="md" delay={0} variant="drift" color="blue" />
        <FloatingDot className="right-[10%] top-[8%]" size="sm" delay={1} variant="slow" color="orange" />
        <FloatingDot className="left-[5%] top-[35%]" size="lg" delay={0.5} variant="default" color="green" />
        <FloatingDot className="right-[15%] top-[28%]" size="md" delay={1.5} variant="drift" color="yellow" />
        <FloatingDot className="left-[15%] top-[55%]" size="sm" delay={2} variant="slow" color="blue" />
        <FloatingDot className="right-[8%] top-[50%]" size="lg" delay={0.8} variant="drift" color="orange" />
        <FloatingDot className="left-[50%] top-[6%]" size="sm" delay={1.2} variant="default" color="green" />
        <FloatingDot className="right-[30%] top-[70%]" size="md" delay={2.5} variant="slow" color="yellow" />
        <FloatingDot className="left-[20%] top-[80%]" size="lg" delay={0.3} variant="drift" color="blue" />
        <FloatingDot className="right-[5%] top-[85%]" size="sm" delay={1.8} variant="default" color="orange" />
        <FloatingDot className="left-[40%] top-[42%]" size="md" delay={2.2} variant="slow" color="green" />
        <FloatingDot className="right-[25%] top-[92%]" size="lg" delay={0.7} variant="drift" color="yellow" />
      </div>

      <article className="relative z-10">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl">
              <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
                Sirketlerin <span className="text-highlight">bilinmeyen detaylari</span>
              </h1>

              <p className="speakable-summary mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                <strong>firmascope</strong>, Turkiye'deki sirketleri anonim olarak degerlendirmenizi saglayan bir platformdur.
                Gercek calisan deneyimleri, <strong>maas bilgisi</strong> ve <strong>mulakat deneyimi</strong> verilerini tek yerde toplar.
                Kimliginizi acik etmeden yorum paylasabilir, sirket secimini daha bilincli yapabilirsiniz.
                Veriye dayali karar vermek isteyen adaylar ve calisanlar icin guvenli bir referans kaynagi sunar.
              </p>

              <section className="direct-answer mx-auto mt-6 max-w-2xl rounded-xl border border-primary/20 bg-primary/5 p-4 text-left">
                <h2 className="text-base font-semibold text-foreground">firmascope nedir?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  firmascope, calisanlarin ve adaylarin sirketler hakkinda anonim degerlendirme, maas bilgisi ve mulakat deneyimi paylastigi topluluk tabanli bir platformdur.
                </p>
              </section>

              <p className="mt-4 text-sm text-muted-foreground md:text-base">
                Populer sirketleri hemen incelemek icin <Link className="font-semibold text-primary hover:underline" to="/sirketler">Sirketler</Link> sayfasina gidebilirsiniz.
              </p>

              <div className="mt-8">
                {!expanded ? (
                  <Button
                    size="lg"
                    className="rounded-full px-10 text-base font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl"
                    onClick={() => setExpanded(true)}
                  >
                    Basla
                  </Button>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {actionItems.map((item, index) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className={`${item.color} flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold text-white opacity-0 shadow-md transition-all hover:scale-105 hover:shadow-lg`}
                        style={{
                          animation: `fadeSlideUp 0.4s ease-out ${index * 0.08}s forwards`,
                        }}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <AnnouncementCarousel />
        <WhyFirmascope />

        <section className="py-10">
          <div className="container mx-auto max-w-4xl px-4">
            <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">
              Turkiye'de Sirket Degerlendirmesi Neden Onemli?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              2026 yilinda yapilan kariyer arastirmalarina gore, adaylarin buyuk bolumu is teklifi oncesinde kurum kulturu ve ucret adaleti hakkinda bagimsiz kaynak ariyor.
              Sirketlerin resmi iletisimi her zaman gercek ekip deneyimini yansitmayabilir; bu nedenle anonim geri bildirimler, adaylarin karar surecinde daha yuksek isabet saglar.
              <strong>Anonim degerlendirme</strong> modeli, calisanlarin cekinmeden geri bildirim birakmasini kolaylastirirken,
              sirketlerin de tekrar eden sorunlari daha hizli tespit etmesine yardimci olur.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">Adaylar icin kazanclar</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  <li>Mulakat surecinin gercek zorluk seviyesini onceden gorursunuz.</li>
                  <li>Rol bazli maas bantlarini karsilastirip pazarlik gucunuz artar.</li>
                  <li>Kultur, yonetim stili ve ekip dengesi hakkinda net sinyaller alirsiniz.</li>
                </ul>
              </section>
              <section className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">Sirketler icin kazanclar</h3>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                  <li>Tekrarlayan sikayetleri erken fark edip iyilestirme yapabilirler.</li>
                  <li>Ise alim markasi acisindan guven olusturacak somut veri elde ederler.</li>
                  <li>Yetkin adaylarla daha uyumlu beklenti yonetimi saglarlar.</li>
                </ol>
              </section>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <section className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">firmascope nedir?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  firmascope; <strong>anonim degerlendirme</strong>, maas paylasimi ve mulakat geri bildirimini tek akista sunan, Turkiye odakli sirket seffaflik platformudur.
                </p>
              </section>
              <section className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-base font-semibold text-foreground">Anonim sirket degerlendirmesi ne demek?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Kullanici kimliginin sakli kaldigi, sadece deneyim bilgisinin paylasildigi ve toplulugun karar kalitesini artiran geri bildirim modelidir.
                </p>
              </section>
            </div>
          </div>
        </section>

        <WhySection />
      </article>
    </Layout>
  );
};

export default Index;
