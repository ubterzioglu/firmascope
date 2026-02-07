import { UserPlus, PenLine, BarChart3, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Anonim Kaydol",
    description: "E-posta ile hızlıca kaydol. Gerçek ismini kimse görmez, sadece takma adın görünür.",
  },
  {
    icon: PenLine,
    title: "Deneyimini Paylaş",
    description: "Çalıştığın veya çalıştığın şirketi değerlendir. Maaş bilgisi ve mülakat deneyimini ekle.",
  },
  {
    icon: BarChart3,
    title: "Şirketleri Keşfet",
    description: "Gerçek çalışan deneyimlerini oku, maaş dağılımlarını gör, bilinçli kariyer kararları ver.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenle Katkıda Bulun",
    description: "Tüm veriler anonim ve KVKK uyumlu. Kimliğin her zaman korunur.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Nasıl Çalışır?
          </h2>
          <p className="mt-3 text-muted-foreground">
            4 adımda şirket kültürünü şeffaflaştır
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                <step.icon className="h-7 w-7 text-accent" />
              </div>
              <div className="mb-2 flex items-center justify-center">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
