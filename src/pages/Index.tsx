import Layout from "@/components/Layout";
import FloatingDot from "@/components/FloatingDot";
import AnnouncementCarousel from "@/components/AnnouncementCarousel";
import WhySection from "@/components/WhySection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Lightbulb, Star, Users, DollarSign } from "lucide-react";
import heroKeyhole from "@/assets/hero.png";

const actionItems = [
  { label: "Şirket Ara", icon: Search, color: "bg-alm-blue", href: "/sirketler" },
  { label: "Şirket Öner", icon: Lightbulb, color: "bg-alm-green", href: "/sirket-oner" },
  { label: "Şirket Değerlendirmesi Ekle", icon: Star, color: "bg-alm-orange", href: "/sirketler" },
  { label: "Mülakat Bilgisi Ekle", icon: Users, color: "bg-alm-yellow", href: "/sirketler" },
  { label: "Maaş Bilgisi Ekle", icon: DollarSign, color: "bg-alm-blue", href: "/sirketler" },
];

const Index = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Layout>
      {/* Global floating dots background */}
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
        <FloatingDot className="left-[65%] top-[25%]" size="sm" delay={3} variant="drift" color="blue" />
        <FloatingDot className="right-[40%] top-[60%]" size="lg" delay={1.6} variant="slow" color="orange" />
      </div>

      {/* Hero */}
      <section className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          {/* Hero Image */}
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 overflow-hidden rounded-3xl shadow-xl">
              <img
                src={heroKeyhole}
                alt="Şirketlerin bilinmeyen detayları"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Title */}
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Şirketlerin <span className="text-highlight">bilinmeyen detayları</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base text-muted-foreground md:text-lg">
              Kimliğin tamamen gizli kalır. Şirket kültürü, maaş ve mülakat deneyimlerini anonim olarak paylaş.
            </p>

            {/* CTA Button / Action Menu */}
            <div className="mt-8">
              {!expanded ? (
                <Button
                  size="lg"
                  className="rounded-full px-10 font-semibold text-base animate-fade-in"
                  onClick={() => setExpanded(true)}
                >
                  Başla!
                </Button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-scale-in">
                  {actionItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`${item.color} flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg`}
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

      {/* Announcement Carousel */}
      <AnnouncementCarousel />

      {/* Why Section */}
      <WhySection />

      {/* CTA Section */}
      <CTASection />
    </Layout>
  );
};

export default Index;
