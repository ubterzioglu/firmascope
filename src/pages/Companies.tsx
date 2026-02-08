import Layout from "@/components/Layout";
import { Search, MapPin, Building2, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Company {
  id: string;
  name: string;
  slug: string;
  initials: string;
  sector: string | null;
  city: string | null;
  size: string | null;
  company_type: string | null;
  status: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

interface ReviewStats {
  company_id: string;
  avg_rating: number;
  review_count: number;
}

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

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
};

const renderStars = (rating: number) => (
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

const cities = ["Tüm Şehirler", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];
const sectors = ["Tüm Sektörler", "Teknoloji", "Finans", "Sağlık", "Enerji", "Lojistik", "Otomotiv", "Medya", "İnşaat", "Eğitim"];

const Companies = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Tüm Şehirler");
  const [sector, setSector] = useState("Tüm Sektörler");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [compRes, statsRes] = await Promise.all([
        supabase.from("companies").select("*").eq("status", "Aktif").order("name"),
        supabase.from("reviews_public" as any).select("company_id, rating"),
      ]);

      setCompanies((compRes.data as Company[]) || []);

      // Aggregate review stats client-side
      const statsMap = new Map<string, { total: number; count: number }>();
      if (statsRes.data) {
        for (const r of statsRes.data as any[]) {
          const existing = statsMap.get(r.company_id) || { total: 0, count: 0 };
          existing.total += r.rating;
          existing.count += 1;
          statsMap.set(r.company_id, existing);
        }
      }
      setReviewStats(
        Array.from(statsMap.entries()).map(([company_id, { total, count }]) => ({
          company_id,
          avg_rating: total / count,
          review_count: count,
        }))
      );
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "Tüm Şehirler" || c.city === city;
    const matchSector = sector === "Tüm Sektörler" || c.sector === sector;
    return matchSearch && matchCity && matchSector;
  });

  const getStats = (companyId: string) => reviewStats.find((s) => s.company_id === companyId);

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
                  <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="h-11 w-[180px] rounded-xl border-border bg-card text-sm">
                <SelectValue placeholder="Tüm Sektörler" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {sectors.map((s) => (
                  <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Yükleniyor...</p>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground text-center">{filtered.length} şirket bulundu</p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((company) => {
                  const colors = getInitialsColor(company.name);
                  const bannerImg = company.banner_url || sectorBanners[company.sector || ""] || defaultBanner;
                  const stats = getStats(company.id);

                  return (
                    <Link
                      key={company.id}
                      to={`/sirket/${company.slug}`}
                      className="group relative rounded-2xl border-2 border-border/80 bg-card overflow-hidden shadow-md transition-all hover:shadow-xl hover:shadow-primary/10"
                    >
                      <div className="relative h-28 overflow-hidden">
                        <img
                          src={bannerImg}
                          alt={company.sector || ""}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                      </div>

                      <div className="relative px-5 pb-5 pt-10">
                        <div className={`absolute -top-7 left-5 flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} font-display text-base font-bold ${colors.fg} shadow-md border-2 border-background z-10`}>
                          {company.logo_url ? (
                            <img src={company.logo_url} alt={company.name} className="h-full w-full object-cover rounded-xl" />
                          ) : (
                            getInitials(company.name)
                          )}
                        </div>

                        <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {company.name}
                        </h3>

                        <div className="mt-1.5 flex items-center gap-1.5">
                          {stats && stats.avg_rating > 0 ? (
                            <>
                              <span className="text-sm font-bold text-foreground">{stats.avg_rating.toFixed(1)}</span>
                              {renderStars(stats.avg_rating)}
                              <span className="text-xs text-muted-foreground">({stats.review_count})</span>
                            </>
                          ) : (
                            <span className="text-xs text-muted-foreground">Henüz değerlendirme yok</span>
                          )}
                        </div>

                        <div className="mt-2 space-y-1">
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {company.city || "–"}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" /> {company.sector || "–"}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {company.size && (
                            <span className="inline-block rounded-full border border-border px-2.5 py-0.5 text-[10px] text-muted-foreground">
                              {company.size} çalışan
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Companies;
