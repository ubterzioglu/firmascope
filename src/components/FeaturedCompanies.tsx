import { Link } from "react-router-dom";
import { Star, MessageSquare, Building2 } from "lucide-react";

const mockCompanies = [
  { slug: "teknoloji-as", name: "Teknoloji A.Ş.", sector: "Teknoloji", city: "İstanbul", rating: 4.2, reviewCount: 128 },
  { slug: "finans-holding", name: "Finans Holding", sector: "Finans", city: "İstanbul", rating: 3.8, reviewCount: 95 },
  { slug: "saglik-grubu", name: "Sağlık Grubu", sector: "Sağlık", city: "Ankara", rating: 4.0, reviewCount: 67 },
  { slug: "enerji-sanayi", name: "Enerji Sanayi", sector: "Enerji", city: "İzmir", rating: 3.5, reviewCount: 42 },
  { slug: "perakende-market", name: "Perakende Market", sector: "Perakende", city: "İstanbul", rating: 3.2, reviewCount: 156 },
  { slug: "yazilim-startup", name: "Yazılım Startup", sector: "Teknoloji", city: "Ankara", rating: 4.5, reviewCount: 34 },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating) ? "fill-warning text-warning" : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

const FeaturedCompanies = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Öne Çıkan Şirketler
          </h2>
          <p className="mt-3 text-muted-foreground">
            En çok değerlendirilen şirketlere göz atın
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockCompanies.map((company) => (
            <Link
              key={company.slug}
              to={`/sirket/${company.slug}`}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted font-display text-lg font-bold text-muted-foreground">
                  {company.name.charAt(0)}
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {company.sector}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                {company.name}
              </h3>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> {company.city}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <RatingStars rating={company.rating} />
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3.5 w-3.5" /> {company.reviewCount} yorum
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/sirketler"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-accent/30 hover:shadow-md"
          >
            Tüm Şirketleri Gör →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCompanies;
