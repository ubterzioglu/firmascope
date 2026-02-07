import Layout from "@/components/Layout";
import FloatingDot from "@/components/FloatingDot";
import AnnouncementCarousel from "@/components/AnnouncementCarousel";
import WhySection from "@/components/WhySection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroKeyhole from "@/assets/hero-keyhole.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Floating dots */}
        <FloatingDot className="left-[8%] top-[20%]" size="md" delay={0} />
        <FloatingDot className="right-[10%] top-[15%]" size="sm" delay={1} />
        <FloatingDot className="left-[5%] bottom-[30%]" size="lg" delay={0.5} />
        <FloatingDot className="right-[15%] bottom-[20%]" size="md" delay={1.5} />
        <FloatingDot className="left-[15%] top-[60%]" size="sm" delay={2} />
        <FloatingDot className="right-[8%] top-[50%]" size="lg" delay={0.8} />
        <FloatingDot className="left-[50%] top-[10%]" size="sm" delay={1.2} />
        <FloatingDot className="right-[30%] bottom-[10%]" size="md" delay={2.5} />

        <div className="container mx-auto px-4 text-center">
          {/* Hero Image */}
          <div className="mx-auto mb-10 max-w-2xl">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={heroKeyhole}
                alt="Şirketlerin gerçek yüzü"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Şirketlerin <span className="text-highlight">gerçek yüzü</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base text-muted-foreground md:text-lg">
            Şirket değerlendirmeleri, maaşlar ve mülakat deneyimleri.
          </p>
          <p className="text-base text-muted-foreground md:text-lg">
            Çalışandan çalışana.
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <Button size="lg" asChild className="rounded-full px-10 font-semibold text-base">
              <Link to="/sirketler">Başla!</Link>
            </Button>
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
