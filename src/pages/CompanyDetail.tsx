import Layout from "@/components/Layout";
import { useParams } from "react-router-dom";
import { MapPin, Building2, Users, Globe, Briefcase, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const mockCompanyData: Record<string, {
  name: string; initials: string; desc: string; city: string; sector: string;
  size: string; reviews: number; salaries: number; interviews: number;
  type: string; status: string;
}> = {
  "edutech-academy": { name: "EduTech Academy", initials: "EA", desc: "Online eğitim platformu ve içerik üretimi", city: "Ankara", sector: "Eğitim", size: "51-200", type: "A.Ş.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "finanspro-as": { name: "FinansPro A.Ş.", initials: "FA", desc: "Finans ve yatırım hizmetleri", city: "İstanbul", sector: "Finans", size: "1000+", type: "A.Ş.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "insaat-plus": { name: "İnşaat Plus", initials: "İP", desc: "Büyük ölçekli inşaat projeleri", city: "İstanbul", sector: "İnşaat", size: "1000+", type: "Ltd.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "logitrans": { name: "LogiTrans", initials: "LO", desc: "Lojistik ve taşımacılık çözümleri", city: "İstanbul", sector: "Lojistik", size: "1000+", type: "A.Ş.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "mediabox": { name: "MediaBox", initials: "ME", desc: "Dijital medya ve içerik üretimi", city: "İstanbul", sector: "Medya", size: "11-50", type: "Ltd.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "mercedes-benz-turk": { name: "Mercedes Benz Türk A.Ş.", initials: "MB", desc: "Otomotiv üretimi ve satışı", city: "İstanbul", sector: "Otomotiv", size: "1000+", type: "A.Ş.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "sagliknet": { name: "SağlıkNet", initials: "SA", desc: "Dijital sağlık hizmetleri", city: "İzmir", sector: "Sağlık", size: "201-1000", type: "A.Ş.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "technova-yazilim": { name: "TechNova Yazılım", initials: "TY", desc: "Yazılım geliştirme ve danışmanlık", city: "İstanbul", sector: "Teknoloji", size: "201-1000", type: "A.Ş.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
  "yesilenerji": { name: "YeşilEnerji", initials: "YE", desc: "Yenilenebilir enerji çözümleri", city: "Ankara", sector: "Enerji", size: "51-200", type: "Ltd.", status: "Aktif", reviews: 0, salaries: 0, interviews: 0 },
};

const CompanyDetail = () => {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const company = mockCompanyData[slug || ""] || {
    name: "Bilinmeyen Şirket", initials: "??", desc: "", city: "—",
    sector: "—", size: "—", type: "—", status: "—",
    reviews: 0, salaries: 0, interviews: 0,
  };

  const tabLabels = [
    "Genel Bakış",
    `Yorumlar (${company.reviews})`,
    `Maaşlar (${company.salaries})`,
    `Mülakatlar (${company.interviews})`,
  ];

  const metaItems = [
    { icon: Briefcase, label: "Şirket Türü", value: company.type },
    { icon: Globe, label: "Durum", value: company.status },
    { icon: Building2, label: "Sektör", value: company.sector },
    { icon: MapPin, label: "Merkez", value: company.city },
    { icon: Users, label: "Çalışan Sayısı", value: company.size },
  ];

  return (
    <Layout>
      {/* Gray gradient hero */}
      <div className="h-32 bg-gradient-to-b from-muted-foreground/40 to-muted/60" />

      <div className="container mx-auto px-4">
        {/* Company header */}
        <div className="-mt-16 flex items-end gap-4">
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-amber font-display text-3xl font-bold text-amber-foreground shadow-lg">
            {company.initials}
          </div>
          <div className="mb-1 rounded-lg bg-primary px-4 py-2">
            <h1 className="font-display text-xl font-bold text-primary-foreground md:text-2xl">
              {company.name}
            </h1>
          </div>
        </div>

        {/* Meta cards row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {metaItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
            >
              <item.icon className="h-5 w-5 flex-shrink-0 text-primary" />
              <div className="min-w-0">
                <div className="text-[11px] text-muted-foreground">{item.label}</div>
                <div className="truncate text-sm font-semibold text-foreground">{item.value}</div>
              </div>
            </div>
          ))}
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
                    ? "border-primary text-foreground"
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
          <div className="space-y-6">
            {activeTab === 0 && (
              <>
                {/* Şirket Bilgileri */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-bold text-foreground">Şirket Bilgileri</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{company.desc}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {company.name}, {company.city} merkezli {company.sector.toLowerCase()} alanında faaliyet göstermektedir.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Şirket bünyesinde {company.size} çalışan bulunmaktadır.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      firmascope üzerinde {company.reviews} değerlendirme ve {company.salaries} maaş bilgisi paylaşılmıştır.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      Çalışanların %0'i bu şirketi tavsiye etmektedir.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {company.interviews} mülakat deneyimi paylaşılmıştır.
                    </li>
                  </ul>
                </div>

                {/* Çalışan Memnuniyeti */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-bold text-foreground">Çalışan Memnuniyeti</h3>
                  <p className="mt-3 text-sm text-muted-foreground">Henüz yeterli veri yok.</p>
                </div>
              </>
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
            <Button className="w-full rounded-xl font-semibold text-sm h-12 bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Maaş Bilgisi Ekle
            </Button>
            <Button className="w-full rounded-xl font-semibold text-sm h-12 bg-amber text-amber-foreground hover:bg-amber/90">
              Mülakat Bilgisi Ekle
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyDetail;
