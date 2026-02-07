import Layout from "@/components/Layout";
import { useParams } from "react-router-dom";
import { MapPin, Building2, Users, Globe, Briefcase, MessageSquare, Banknote, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const sectorBanners: Record<string, string> = {
  "Eğitim": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=300&fit=crop",
  "Finans": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=300&fit=crop",
  "İnşaat": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=300&fit=crop",
  "Lojistik": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=300&fit=crop",
  "Medya": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=300&fit=crop",
  "Otomotiv": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=300&fit=crop",
  "Sağlık": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=300&fit=crop",
  "Teknoloji": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop",
  "Enerji": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=300&fit=crop",
};

const defaultBanner = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=300&fit=crop";

const initialsColors = [
  { bg: "bg-amber", fg: "text-amber-foreground" },
  { bg: "bg-primary", fg: "text-primary-foreground" },
  { bg: "bg-destructive", fg: "text-destructive-foreground" },
];

function getInitialsColor(name: string) {
  const index = name.charCodeAt(0) % initialsColors.length;
  return initialsColors[index];
}

const mockCompanyData: Record<string, {
  name: string; initials: string; desc: string; city: string; sector: string;
  size: string; reviews: number; salaries: number; interviews: number;
  type: string; status: string; logo?: string; banner?: string;
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

  const bannerUrl = company.banner || sectorBanners[company.sector] || defaultBanner;
  const colors = getInitialsColor(company.name);

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
      {/* Banner */}
      <div className="relative h-36 md:h-44 overflow-hidden">
        <img
          src={bannerUrl}
          alt={`${company.name} banner`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
      </div>

      <div className="container mx-auto px-4">
        {/* Company header */}
        <div className="-mt-14 flex items-end">
          {/* Logo / Initials */}
          <div className="z-10">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-24 w-24 flex-shrink-0 rounded-2xl border-4 border-background object-cover shadow-lg"
              />
            ) : (
              <div className={`flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl border-4 border-background ${colors.bg} font-display text-2xl font-bold ${colors.fg} shadow-lg`}>
                {company.initials}
              </div>
            )}
          </div>
          {/* Name badge - overlaps behind logo */}
          <div className="-ml-3 mb-1 rounded-r-lg bg-alm-orange px-4 pl-6 py-1.5 shadow-md">
            <h1 className="font-display text-sm font-bold text-primary-foreground md:text-base">
              {company.name}
            </h1>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-muted-foreground">{company.desc}</p>

        {/* Meta cards row */}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5 md:flex-nowrap">
          {metaItems.map((item) => (
            <div
              key={item.label}
              className="flex w-[calc(50%-0.375rem)] items-center justify-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 md:w-0 md:flex-1"
            >
              <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
              <div className="text-center">
                <div className="text-[9px] leading-tight text-muted-foreground">{item.label}</div>
                <div className="text-xs font-semibold text-foreground">{item.value}</div>
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
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-bold text-foreground">Çalışan Memnuniyeti</h3>
                  <p className="mt-3 text-sm text-muted-foreground">Henüz yeterli veri yok.</p>
                </div>
              </>
            )}
            {activeTab === 1 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="mt-4 font-display text-base font-bold text-foreground">İlk değerlendirmeyi sen yaz</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bu şirket hakkında henüz yorum yapılmamış. Deneyimini paylaş!
                </p>
                <Button className="mt-5 w-full max-w-sm rounded-xl font-semibold text-sm h-11">
                  Değerlendirme Yaz
                </Button>
              </div>
            )}
            {activeTab === 2 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <Banknote className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="mt-4 font-display text-base font-bold text-foreground">İlk maaş bilgisini sen ekle</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bu şirket hakkında henüz maaş bilgisi eklenmemiş. Bilgini paylaş!
                </p>
                <Button className="mt-5 w-full max-w-sm rounded-xl font-semibold text-sm h-11 bg-alm-orange text-primary-foreground hover:bg-alm-orange/90">
                  Maaş Bilgisi Ekle
                </Button>
              </div>
            )}
            {activeTab === 3 && (
              <div className="rounded-2xl border border-border bg-card p-10 text-center">
                <UserCheck className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <h3 className="mt-4 font-display text-base font-bold text-foreground">İlk mülakat deneyimini sen paylaş</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Bu şirket hakkında henüz mülakat deneyimi paylaşılmamış. Deneyimini ekle!
                </p>
                <Button className="mt-5 w-full max-w-sm rounded-xl font-semibold text-sm h-11 bg-amber text-amber-foreground hover:bg-amber/90">
                  Mülakat Bilgisi Ekle
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
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
            <Button className="w-full rounded-xl font-semibold text-sm h-12">
              Değerlendirme Yaz
            </Button>
            <Button className="w-full rounded-xl font-semibold text-sm h-12 bg-alm-orange text-primary-foreground hover:bg-alm-orange/90">
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
