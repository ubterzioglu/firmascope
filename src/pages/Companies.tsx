import Layout from "@/components/Layout";
import { Search, MapPin, Building2, Heart, Star, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sectorBanners: Record<string, string> = {
  "Eğitim": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop&q=70",
  "Finans": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&q=70",
  "İnşaat": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=200&fit=crop&q=70",
  "Lojistik": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop&q=70",
  "Medya": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=200&fit=crop&q=70",
  "Otomotiv": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop&q=70",
  "Sağlık": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&q=70",
  "Teknoloji": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop&q=70",
  "Enerji": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop&q=70",
};

const defaultBanner = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop&q=70";

const initialsColors = [
  { bg: "bg-amber", fg: "text-amber-foreground" },
  { bg: "bg-alm-blue", fg: "text-primary-foreground" },
  { bg: "bg-alm-green", fg: "text-primary-foreground" },
  { bg: "bg-alm-orange", fg: "text-primary-foreground" },
];

function getInitialsColor(name: string) {
  const index = name.charCodeAt(0) % initialsColors.length;
  return initialsColors[index];
}

const mockCompanies = [
  { slug: "edutech-academy", name: "EduTech Academy", city: "Ankara", sector: "Eğitim", size: "51-200 çalışan", verified: false, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "finanspro-as", name: "FinansPro A.Ş.", city: "İstanbul", sector: "Finans", size: "1000+ çalışan", verified: true, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "insaat-plus", name: "İnşaat Plus", city: "İstanbul", sector: "İnşaat", size: "1000+ çalışan", verified: false, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "logitrans", name: "LogiTrans", city: "İstanbul", sector: "Lojistik", size: "1000+ çalışan", verified: false, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "mediabox", name: "MediaBox", city: "İstanbul", sector: "Medya", size: "11-50 çalışan", verified: false, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "mercedes-benz-turk", name: "Mercedes Benz Türk A.Ş.", city: "İstanbul", sector: "Otomotiv", size: "1000+ çalışan", verified: false, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "sagliknet", name: "SağlıkNet", city: "İzmir", sector: "Sağlık", size: "201-1000 çalışan", verified: true, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "technova-yazilim", name: "TechNova Yazılım", city: "İstanbul", sector: "Teknoloji", size: "201-1000 çalışan", verified: false, rating: 0, reviews: 0, recommendation: 0 },
  { slug: "yesilenerji", name: "YeşilEnerji", city: "Ankara", sector: "Enerji", size: "51-200 çalışan", verified: false, rating: 0, reviews: 0, recommendation: 0 },
];

const cities = ["Tüm Şehirler", "İstanbul", "Ankara", "İzmir"];
const sectors = ["Tüm Sektörler", "Teknoloji", "Finans", "Sağlık", "Enerji", "Lojistik", "Otomotiv", "Medya", "İnşaat", "Eğitim"];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
};

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.round(rating)
              ? "fill-alm-yellow text-alm-yellow"
              : "fill-muted text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
};

const Companies = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Tüm Şehirler");
  const [sector, setSector] = useState("Tüm Sektörler");

  const filtered = mockCompanies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "Tüm Şehirler" || c.city === city;
    const matchSector = sector === "Tüm Sektörler" || c.sector === sector;
    return matchSearch && matchCity && matchSector;
  });

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground mb-6 text-center">Şirketler</h1>

          {/* Search */}
          <div className="relative mx-auto max-w-xl mb-4">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şirket ara..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Filters */}
          <div className="flex justify-center gap-3 mb-4">
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-11 w-[180px] rounded-xl border-border bg-card text-sm">
                <SelectValue placeholder="Tüm Şehirler" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {cities.map((c) => (
                  <SelectItem key={c} value={c} className="rounded-lg">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="h-11 w-[180px] rounded-xl border-border bg-card text-sm">
                <SelectValue placeholder="Tüm Sektörler" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {sectors.map((s) => (
                  <SelectItem key={s} value={s} className="rounded-lg">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="mb-6 text-sm text-muted-foreground text-center">{filtered.length} şirket bulundu</p>

          {/* Company Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((company) => {
              const colors = getInitialsColor(company.name);
              const bannerImg = sectorBanners[company.sector] || defaultBanner;

              return (
                <Link
                  key={company.slug}
                  to={`/sirket/${company.slug}`}
                  className="group relative rounded-2xl border-2 border-border/80 bg-card overflow-hidden shadow-md transition-all hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Banner image */}
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={bannerImg}
                      alt={company.sector}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />

                    {/* Favorite */}
                    <button
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground/60 backdrop-blur-sm hover:text-destructive transition-colors"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      aria-label="Favorilere ekle"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="relative px-5 pb-5 pt-10">
                    {/* Avatar - positioned to straddle banner */}
                    <div className={`absolute -top-7 left-5 flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} font-display text-base font-bold ${colors.fg} shadow-md border-2 border-background z-10`}>
                      {getInitials(company.name)}
                    </div>

                    {/* Name */}
                    <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5 truncate">
                      {company.name}
                      {company.verified && (
                        <svg className="h-4 w-4 text-alm-green flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      )}
                    </h3>

                    {/* Rating */}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {company.rating > 0 ? (
                        <>
                          <span className="text-sm font-bold text-foreground">{company.rating.toFixed(1)}</span>
                          {renderStars(company.rating)}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Henüz değerlendirme yok</span>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {company.city}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3" /> {company.sector}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-[10px] text-muted-foreground">
                        {company.size}
                      </span>
                      {company.recommendation > 0 && (
                        <span className="inline-block rounded-full bg-alm-green/10 px-2.5 py-0.5 text-[10px] font-medium text-alm-green">
                          %{company.recommendation} Tavsiye
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Companies;
