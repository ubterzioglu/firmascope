import Layout from "@/components/Layout";
import FloatingDot from "@/components/FloatingDot";
import AnnouncementCarousel from "@/components/AnnouncementCarousel";
import WhySection from "@/components/WhySection";
import WhyFirmascope from "@/components/WhyFirmascope";
import JsonLd from "@/components/JsonLd";
import { homepageFaqItems } from "@/lib/homepage-faq";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Lightbulb, Star, Users, DollarSign, UserPlus } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { generateJsonLd, generateMeta, seoConfig } from "@/lib/seo";

const actionItems = [
  { label: "Şirket Ara", icon: Search, color: "bg-alm-blue", href: "/sirketler" },
  { label: "Şirket Öner", icon: Lightbulb, color: "bg-alm-green", href: "/sirket-oner" },
  { label: "Şirket Değerlendirmesi Ekle", icon: Star, color: "bg-alm-orange", href: "/sirketler" },
  { label: "Mülakat Bilgisi Ekle", icon: Users, color: "bg-alm-yellow", href: "/sirketler" },
  { label: "Maaş Bilgisi Ekle", icon: DollarSign, color: "bg-alm-teal", href: "/sirketler" },
  { label: "Üye Ol", icon: UserPlus, color: "bg-alm-red", href: "/giris" },
];

const Index = () => {
  const [expanded, setExpanded] = useState(false);

  const meta = generateMeta({
    title: "Anonim şirket değerlendirme platformu | firmascope",
    appendTitleSuffix: false,
    description:
      "firmascope, Türkiye'deki şirketleri anonim olarak değerlendirmenizi sağlayan platformdur. Gerçek çalışan deneyimleri, maaş bilgisi ve mülakat süreçlerini güvenle paylaşabilirsiniz.",
    path: "/",
    keywords: [
      "anonim şirket değerlendirme",
      "maaş bilgisi",
      "mülakat deneyimi",
      "Türkiye şirket yorumları",
    ],
  });

  const organizationJsonLd = generateJsonLd.organization([
    "https://www.linkedin.com",
    "https://x.com",
    "https://www.youtube.com",
  ]);
  const websiteJsonLd = generateJsonLd.website();
  const faqJsonLd = generateJsonLd.faq(
    homepageFaqItems.map((item) => ({ question: item.question, answer: item.answer }))
  );
  const webPageJsonLd = generateJsonLd.webPage({
    type: "CollectionPage",
    name: meta.title,
    headline: "Anonim Şirket Değerlendirme Platformu — firmascope",
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
                Şirketlerin <span className="text-highlight">bilinmeyen detayları</span>
              </h1>

              <p className="speakable-summary mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                <strong>firmascope</strong>, Türkiye'deki şirketleri anonim olarak değerlendirmenizi sağlayan bir platformdur.
                Gerçek çalışan deneyimleri, <strong>maaş bilgisi</strong> ve <strong>mülakat deneyimi</strong> verilerini tek yerde toplar.
                Kimliğinizi açık etmeden yorum paylaşabilir, şirket seçimini daha bilinçli yapabilirsiniz.
                Veriye dayalı karar vermek isteyen adaylar ve çalışanlar için güvenli bir referans kaynağı sunar.
              </p>

              <section className="direct-answer mx-auto mt-6 max-w-2xl rounded-xl border border-primary/20 bg-primary/5 p-4 text-left">
                <h2 className="text-base font-semibold text-foreground">firmascope nedir?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  firmascope, çalışanların ve adayların şirketler hakkında anonim değerlendirme, maaş bilgisi ve mülakat deneyimi paylaştığı topluluk tabanlı bir platformdur.
                </p>
              </section>

              <p className="mt-4 text-sm text-muted-foreground md:text-base">
                Popüler şirketleri hemen incelemek için <Link className="font-semibold text-primary hover:underline" to="/sirketler">Şirketler</Link> sayfasına gidebilirsiniz.
              </p>

              <div className="mt-8">
                {!expanded ? (
                  <Button
                    size="lg"
                    className="rounded-full px-10 text-base font-semibold transition-all duration-300 hover:scale-110 hover:shadow-xl"
                    onClick={() => setExpanded(true)}
                  >
                    Başla
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
            <div className="rounded-lg border border-border bg-card px-5 py-6 shadow-sm md:px-8 md:py-8">
              <h2 className="text-center font-display text-2xl font-bold text-foreground md:text-3xl">
                Türkiye'de Şirket Değerlendirmesi Neden Önemli?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                2026 yılında yapılan kariyer araştırmalarına göre, adayların büyük bölümü iş teklifi öncesinde kurum kültürü ve ücret adaleti hakkında bağımsız kaynak arıyor.
                Şirketlerin resmi iletişimi her zaman gerçek ekip deneyimini yansıtmayabilir; bu nedenle anonim geri bildirimler, adayların karar sürecinde daha yüksek isabet sağlar.
                <strong>Anonim değerlendirme</strong> modeli, çalışanların çekinmeden geri bildirim bırakmasını kolaylaştırırken,
                şirketlerin de tekrar eden sorunları daha hızlı tespit etmesine yardımcı olur.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <section className="rounded-lg border border-border/80 bg-alm-blue/5 p-4">
                  <h3 className="text-base font-semibold text-foreground">Adaylar için kazanımlar</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                    <li>Mülakat sürecinin gerçek zorluk seviyesini önceden görebilir ve buna göre hazırlık yapabilirsiniz.</li>
                    <li>Rol bazlı maaş bantlarını karşılaştırarak kendi deneyiminizi değerlendirebilir ve pazarlık gücünüzü artırabilirsiniz.</li>
                    <li>Kültür, yönetim stili ve ekip dengesi hakkında net sinyaller alarak daha isabetli tercihler yapabilirsiniz.</li>
                  </ul>
                </section>
                <section className="rounded-lg border border-border/80 bg-alm-green/5 p-4">
                  <h3 className="text-base font-semibold text-foreground">Şirketler için kazanımlar</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
                    <li>Tekrarlayan şikayet kalıplarını erken fark edip hedefli iyileştirme adımları atabilirler.</li>
                    <li>İşe alım markası açısından güven oluşturacak, çalışan geri bildirimlerine dayalı somut veri elde ederler.</li>
                    <li>Yetkin adaylarla daha uyumlu beklenti yönetimi sağlayarak işe alım süreçlerini hızlandırırlar.</li>
                  </ul>
                </section>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <section className="rounded-lg border border-border/80 bg-alm-yellow/10 p-4">
                  <h3 className="text-base font-semibold text-foreground">firmascope nedir?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    firmascope; <strong>anonim değerlendirme</strong>, maaş paylaşımı ve mülakat geri bildirimini tek akışta sunan, Türkiye odaklı şirket şeffaflık platformudur.
                  </p>
                </section>
                <section className="rounded-lg border border-border/80 bg-alm-orange/5 p-4">
                  <h3 className="text-base font-semibold text-foreground">Anonim şirket değerlendirmesi ne demek?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Kullanıcı kimliğinin saklı kaldığı, sadece deneyim bilgisinin paylaşıldığı ve topluluğun karar kalitesini artıran geri bildirim modelidir.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>

        <WhySection />

        <section aria-labelledby="sources-title" className="py-10">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="rounded-lg border border-border bg-card px-5 py-6 shadow-sm">
              <h2 id="sources-title" className="text-center font-display text-2xl font-bold text-foreground">
                Kaynaklar ve Ek Okuma
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>
                  <a href="https://en.wikipedia.org/wiki/Employer_branding" target="_blank" rel="noopener">
                    Employer branding kavramı ve şirket değerlendirmelerinin önemi — Wikipedia
                  </a>
                </li>
                <li>
                  <a href="https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data" target="_blank" rel="noopener">
                    Yapılandırılmış veri rehberi — Google Search Central
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
};

export default Index;
