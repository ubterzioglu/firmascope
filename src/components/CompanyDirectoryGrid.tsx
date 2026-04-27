import { Link } from "react-router-dom";
import { Building2, MapPin, Star } from "lucide-react";

export interface DirectoryCompany {
  id: string;
  name: string;
  slug: string;
  sector: string | null;
  city: string | null;
  size: string | null;
  logo_url: string | null;
  banner_url: string | null;
}

export interface DirectoryReviewStats {
  company_id: string;
  avg_rating: number;
  review_count: number;
}

const sectorBanners: Record<string, string> = {
  Eğitim: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop&q=70",
  Finans: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop&q=70",
  İnşaat: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=200&fit=crop&q=70",
  Lojistik: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop&q=70",
  Medya: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=200&fit=crop&q=70",
  Otomotiv: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=200&fit=crop&q=70",
  Sağlık: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=200&fit=crop&q=70",
  Teknoloji: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop&q=70",
  Enerji: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop&q=70",
};

const defaultBanner = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop&q=70";

const initialsColors = [
  { bg: "bg-amber", fg: "text-amber-foreground" },
  { bg: "bg-alm-blue", fg: "text-primary-foreground" },
  { bg: "bg-alm-green", fg: "text-primary-foreground" },
  { bg: "bg-alm-orange", fg: "text-primary-foreground" },
];

const getInitialsColor = (name: string) => {
  const index = name.charCodeAt(0) % initialsColors.length;
  return initialsColors[index];
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

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

type CompanyDirectoryGridProps = {
  companies: DirectoryCompany[];
  reviewStats: DirectoryReviewStats[];
};

const CompanyDirectoryGrid = ({ companies, reviewStats }: CompanyDirectoryGridProps) => {
  const getStats = (companyId: string) => reviewStats.find((stat) => stat.company_id === companyId);

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {companies.map((company) => {
        const colors = getInitialsColor(company.name);
        const bannerImg = company.banner_url || sectorBanners[company.sector || ""] || defaultBanner;
        const stats = getStats(company.id);

        return (
          <Link
            key={company.id}
            to={`/sirket/${company.slug}`}
            className="group relative overflow-hidden rounded-2xl border-2 border-border/80 bg-card shadow-md transition-all hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="relative h-28 overflow-hidden">
              <img
                src={bannerImg}
                alt={`${company.name} sektörü ${company.sector || "genel"} şirket kart görseli`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>

            <div className="relative px-5 pb-5 pt-10">
              <div
                className={`absolute -top-7 left-5 z-10 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-background ${colors.bg} font-display text-base font-bold ${colors.fg} shadow-md`}
              >
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="h-full w-full rounded-xl object-cover" />
                ) : (
                  getInitials(company.name)
                )}
              </div>

              <h2 className="truncate font-display text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                {company.name}
              </h2>

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
                  <MapPin className="h-3 w-3" /> {company.city || "-"}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" /> {company.sector || "-"}
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
  );
};

export default CompanyDirectoryGrid;
