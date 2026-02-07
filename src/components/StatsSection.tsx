const stats = [
  { value: "10,000+", label: "Şirket Değerlendirmesi" },
  { value: "5,000+", label: "Kayıtlı Şirket" },
  { value: "50,000+", label: "Anonim Katkıcı" },
  { value: "%100", label: "Anonim & Güvenli" },
];

const StatsSection = () => {
  return (
    <section className="hero-gradient py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl font-bold text-accent md:text-4xl">
                {stat.value}
              </div>
              <p className="mt-1 text-sm text-primary-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
