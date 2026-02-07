import Layout from "@/components/Layout";
import { Search, Building2, Star, MessageSquare, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const mockCompanies = [
  { slug: "teknoloji-as", name: "Teknoloji A.Ş.", sector: "Teknoloji", city: "İstanbul", rating: 4.2, reviewCount: 128, size: "201-1000" },
  { slug: "finans-holding", name: "Finans Holding", sector: "Finans", city: "İstanbul", rating: 3.8, reviewCount: 95, size: "1000+" },
  { slug: "saglik-grubu", name: "Sağlık Grubu", sector: "Sağlık", city: "Ankara", rating: 4.0, reviewCount: 67, size: "51-200" },
  { slug: "enerji-sanayi", name: "Enerji Sanayi", sector: "Enerji", city: "İzmir", rating: 3.5, reviewCount: 42, size: "201-1000" },
  { slug: "perakende-market", name: "Perakende Market", sector: "Perakende", city: "İstanbul", rating: 3.2, reviewCount: 156, size: "1000+" },
  { slug: "yazilim-startup", name: "Yazılım Startup", sector: "Teknoloji", city: "Ankara", rating: 4.5, reviewCount: 34, size: "11-50" },
  { slug: "medya-grubu", name: "Medya Grubu", sector: "Medya", city: "İstanbul", rating: 3.9, reviewCount: 78, size: "51-200" },
  { slug: "insaat-holding", name: "İnşaat Holding", sector: "İnşaat", city: "İstanbul", rating: 3.1, reviewCount: 45, size: "1000+" },
];

const Companies = () => {
  const [search, setSearch] = useState("");

  const filtered = mockCompanies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <section className="border-b border-border bg-muted/30 py-10">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Şirketler</h1>
          <p className="mt-2 text-muted-foreground">Türkiye'deki şirketleri keşfet ve değerlendir</p>
          <div className="relative mt-6 max-w-lg">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şirket ara..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-sm text-muted-foreground">{filtered.length} şirket bulundu</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((company) => (
              <Link
                key={company.slug}
                to={`/sirket/${company.slug}`}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted font-display text-base font-bold text-muted-foreground">
                    {company.name.charAt(0)}
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{company.sector}</span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground group-hover:text-accent transition-colors">{company.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" /> {company.city} · {company.size} çalışan
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-semibold">{company.rating.toFixed(1)}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3 w-3" /> {company.reviewCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Companies;
