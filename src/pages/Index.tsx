import Layout from "@/components/Layout";
import HeroSearch from "@/components/HeroSearch";
import HowItWorks from "@/components/HowItWorks";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import StatsSection from "@/components/StatsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, Lock, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-24 md:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl" style={{ color: 'hsl(210 30% 95%)' }}>
              Şirketler hakkında{" "}
              <span className="text-gradient">gerçek bilgi</span>,{" "}
              tamamen anonim.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed" style={{ color: 'hsl(210 20% 75%)' }}>
              Çalışanların ve eski çalışanların deneyimlerini keşfet. Maaşları, mülakat süreçlerini ve şirket kültürünü öğren.
            </p>
            <div className="mt-10 flex justify-center">
              <HeroSearch />
            </div>

            {/* Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/10 px-4 py-1.5 text-xs font-medium" style={{ color: 'hsl(210 20% 75%)' }}>
                <Lock className="h-3 w-3 text-accent" /> KVKK Uyumlu
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/10 px-4 py-1.5 text-xs font-medium" style={{ color: 'hsl(210 20% 75%)' }}>
                <Eye className="h-3 w-3 text-accent" /> %100 Anonim
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/10 px-4 py-1.5 text-xs font-medium" style={{ color: 'hsl(210 20% 75%)' }}>
                <TrendingUp className="h-3 w-3 text-accent" /> Gerçek Veriler
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Featured Companies */}
      <FeaturedCompanies />

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl rounded-3xl hero-gradient p-12 md:p-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl" style={{ color: 'hsl(210 30% 95%)' }}>
              Deneyimini paylaş, fark yarat
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base" style={{ color: 'hsl(210 20% 75%)' }}>
              Binlerce çalışan gibi sen de şirket deneyimini anonim olarak paylaş ve diğerlerine yol göster.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/kayit">Hemen Başla</Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/sirketler">Şirketleri Keşfet</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
