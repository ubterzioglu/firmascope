const features = [
  {
    title: "Gerçek Deneyimler",
    desc: "Sahte yorumları engelliyoruz. Sadece gerçek çalışan deneyimleri. Doğrulanmış ve tarafsız.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop&q=80",
  },
  {
    title: "Tam Anonimlik",
    desc: "Kimliğin her zaman korunur. Takma adınla katkıda bulun, gerçek ismin asla görünmez.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=400&h=400&fit=crop&q=80",
  },
];

const WhySection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Neden <span className="text-highlight">firmascope</span>?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Çalışanların güvenle deneyimlerini paylaştığı, şeffaf bir ekosistem.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-8 text-center transition-shadow hover:shadow-lg"
            >
              <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full">
                <img
                  src={f.image}
                  alt={f.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
