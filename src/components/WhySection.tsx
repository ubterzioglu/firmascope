import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const features = [
  {
    title: "Gerçek Deneyimler",
    desc: "Sahte yorumları engelliyoruz. Sadece gerçek çalışan deneyimleri. Doğrulanmış ve tarafsız.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Tamamen Anonim",
    desc: "Kimliğin %100 gizli kalır. IP adresi, e-posta veya kişisel bilgiler asla paylaşılmaz.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Şeffaf Maaş Bilgileri",
    desc: "Gerçek çalışanların paylaştığı maaş verileriyle sektörünüzdeki yerinizi bilin.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Mülakat Deneyimleri",
    desc: "Başvuracağınız şirketin mülakat sürecini önceden öğrenin, hazırlıklı olun.",
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=600&h=400&fit=crop&q=80",
  },
  {
    title: "Topluluk Gücü",
    desc: "Binlerce çalışanın deneyimlerinden yararlanın, bilinçli kariyer kararları verin.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&q=80",
  },
];

const WhySection = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % features.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + features.length) % features.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Neden <span className="text-highlight">firmascope</span>?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Çalışanların güvenle deneyimlerini paylaştığı, şeffaf bir ekosistem.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative mx-auto max-w-lg"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Card */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Image - top 50% */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={features[current].image}
                alt={features[current].title}
                className="h-full w-full object-cover transition-transform duration-500"
                loading="lazy"
              />
            </div>
            {/* Text - bottom */}
            <div className="p-6 md:p-8">
              <h3 className="font-display text-xl font-bold text-foreground md:text-2xl">
                {features[current].title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed md:text-base">
                {features[current].desc}
              </p>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-md transition-colors hover:bg-muted"
            aria-label="Önceki"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-md transition-colors hover:bg-muted"
            aria-label="Sonraki"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
