import Layout from "@/components/Layout";
import { useParams } from "react-router-dom";
import { MapPin, Building2, Users, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mockCompanyData: Record<string, { name: string; initials: string; desc: string; city: string; sector: string; size: string; reviews: number; salaries: number; interviews: number }> = {
  "edutech-academy": { name: "EduTech Academy", initials: "EA", desc: "Online eğitim platformu ve içerik üretimi", city: "Ankara", sector: "Eğitim", size: "51-200 çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "finanspro-as": { name: "FinansPro A.Ş.", initials: "FA", desc: "Finans ve yatırım hizmetleri", city: "İstanbul", sector: "Finans", size: "1000+ çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "insaat-plus": { name: "İnşaat Plus", initials: "İP", desc: "Büyük ölçekli inşaat projeleri", city: "İstanbul", sector: "İnşaat", size: "1000+ çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "logitrans": { name: "LogiTrans", initials: "LO", desc: "Lojistik ve taşımacılık çözümleri", city: "İstanbul", sector: "Lojistik", size: "1000+ çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "mediabox": { name: "MediaBox", initials: "ME", desc: "Dijital medya ve içerik üretimi", city: "İstanbul", sector: "Medya", size: "11-50 çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "mercedes-benz-turk": { name: "Mercedes Benz Türk A.Ş.", initials: "MB", desc: "Otomotiv üretimi ve satışı", city: "İstanbul", sector: "Otomotiv", size: "1000+ çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "sagliknet": { name: "SağlıkNet", initials: "SA", desc: "Dijital sağlık hizmetleri", city: "İzmir", sector: "Sağlık", size: "201-1000 çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "technova-yazilim": { name: "TechNova Yazılım", initials: "TY", desc: "Yazılım geliştirme ve danışmanlık", city: "İstanbul", sector: "Teknoloji", size: "201-1000 çalışan", reviews: 0, salaries: 0, interviews: 0 },
  "yesilenerji": { name: "YeşilEnerji", initials: "YE", desc: "Yenilenebilir enerji çözümleri", city: "Ankara", sector: "Enerji", size: "51-200 çalışan", reviews: 0, salaries: 0, interviews: 0 },
};

const tabs = ["Genel Bakış", "Yorumlar", "Maaşlar", "Mülakatlar"];

const CompanyDetail = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const company = mockCompanyData[slug || ""] || {
    name: "Bilinmeyen Şirket",
    initials: "??",
    desc: "",
    city: "—",
    sector: "—",
    size: "—",
    reviews: 0,
    salaries: 0,
    interviews: 0,
  };

  const tabLabels = [
    "Genel Bakış",
    `Yorumlar (${company.reviews})`,
    `Maaşlar (${company.salaries})`,
    `Mülakatlar (${company.interviews})`,
  ];

  return (
    <Layout>
      {/* Gray gradient hero */}
      <div className="h-28 bg-gradient-to-b from-muted-foreground/30 to-muted/50" />

      {/* Company header */}
      <div className="container mx-auto px-4">
        <div className="-mt-12 flex items-end gap-5">
          {/* Avatar */}
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-amber font-display text-2xl font-bold text-amber-foreground shadow-lg">
            {company.initials}
          </div>
          <div className="pb-1">
            <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">{company.name}</h1>
          </div>
          {/* Rating area */}
          <div className="ml-auto hidden items-center gap-2 pb-1 md:flex">
            <span className="text-2xl font-bold text-muted-foreground">—</span>
            <span className="text-sm text-muted-foreground">{company.reviews} değerlendirme</span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-muted-foreground">{company.desc}</p>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {company.city}
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> {company.sector}
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {company.size}
          </span>
          <span className="text-border">|</span>
          <span>{company.reviews} değerlendirme</span>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-border">
          <div className="flex gap-0 overflow-x-auto">
            {tabLabels.map((label, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
                  activeTab === i
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 grid gap-6 pb-16 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div>
            {activeTab === 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-semibold text-foreground">Çalışan Memnuniyeti</h3>
                <p className="mt-3 text-sm text-muted-foreground">Henüz yeterli veri yok.</p>
              </div>
            )}
            {activeTab === 1 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">Henüz yorum yapılmamış.</p>
              </div>
            )}
            {activeTab === 2 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">Henüz maaş bilgisi eklenmemiş.</p>
              </div>
            )}
            {activeTab === 3 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">Henüz mülakat deneyimi paylaşılmamış.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">Hızlı Bilgiler</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-display text-2xl font-bold text-foreground">{company.reviews}</div>
                  <div className="text-xs text-muted-foreground">Yorum</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-foreground">{company.salaries}</div>
                  <div className="text-xs text-muted-foreground">Maaş</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-foreground">{company.interviews}</div>
                  <div className="text-xs text-muted-foreground">Mülakat</div>
                </div>
              </div>
            </div>

            {/* CTA buttons */}
            <Button className="w-full rounded-xl font-semibold text-sm h-12">
              Değerlendirme Yaz
            </Button>
            <Button variant="outline" className="w-full rounded-xl font-semibold text-sm h-12">
              Maaş Bilgisi Ekle
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetail;
