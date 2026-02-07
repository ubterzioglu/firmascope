import Layout from "@/components/Layout";
import { Shield, Eye, Lock, Users } from "lucide-react";

const About = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="font-display text-4xl font-bold text-foreground">Hakkında</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Firmascope, Türkiye'de çalışanların ve eski çalışanların şirket deneyimlerini tamamen anonim, güvenilir ve KVKK uyumlu şekilde paylaşabildiği bir platformdur.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Eye, title: "Şeffaflık", desc: "Şirket kültürü, çalışma koşulları ve maaş gerçekliğini çalışan perspektifinden görünür kılıyoruz." },
              { icon: Lock, title: "Anonimlik", desc: "Gerçek ismini kimse görmez. Takma adınla katkıda bulun, kimliğin her zaman korunur." },
              { icon: Shield, title: "Güvenlik", desc: "Minimum veri toplama, KVKK uyumu ve güçlü moderasyon ile güvenliğini sağlıyoruz." },
              { icon: Users, title: "Topluluk", desc: "Binlerce çalışan deneyimlerini paylaşarak birbirine yol gösteriyor." },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <item.icon className="mb-3 h-8 w-8 text-accent" />
                <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
