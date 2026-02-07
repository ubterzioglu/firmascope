import Layout from "@/components/Layout";
import { Search, MapPin, Building2, Heart } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const mockCompanies = [
  { slug: "edutech-academy", name: "EduTech Academy", city: "Ankara", sector: "Eğitim", size: "51-200 çalışan", verified: false },
  { slug: "finanspro-as", name: "FinansPro A.Ş.", city: "İstanbul", sector: "Finans", size: "1000+ çalışan", verified: true },
  { slug: "insaat-plus", name: "İnşaat Plus", city: "İstanbul", sector: "İnşaat", size: "1000+ çalışan", verified: false },
  { slug: "logitrans", name: "LogiTrans", city: "İstanbul", sector: "Lojistik", size: "1000+ çalışan", verified: false },
  { slug: "mediabox", name: "MediaBox", city: "İstanbul", sector: "Medya", size: "11-50 çalışan", verified: false },
  { slug: "mercedes-benz-turk", name: "Mercedes Benz Türk A.Ş.", city: "İstanbul", sector: "Otomotiv", size: "1000+ çalışan", verified: false },
  { slug: "sagliknet", name: "SağlıkNet", city: "İzmir", sector: "Sağlık", size: "201-1000 çalışan", verified: true },
  { slug: "technova-yazilim", name: "TechNova Yazılım", city: "İstanbul", sector: "Teknoloji", size: "201-1000 çalışan", verified: false },
  { slug: "yesilenerji", name: "YeşilEnerji", city: "Ankara", sector: "Enerji", size: "51-200 çalışan", verified: false },
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
          <h1 className="font-display text-3xl font-bold text-foreground mb-6">Şirketler</h1>

          {/* Search + Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Şirket ara..."
                className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-11 rounded-xl border border-border bg-card px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="h-11 rounded-xl border border-border bg-card px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">{filtered.length} şirket bulundu</p>

          {/* Company Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((company) => (
              <Link
                key={company.slug}
                to={`/sirket/${company.slug}`}
                className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Gradient top */}
                <div className="card-gradient-top h-16" />

                {/* Favorite */}
                <button
                  className="absolute right-3 top-3 text-muted-foreground/40 hover:text-destructive transition-colors"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  aria-label="Favorilere ekle"
                >
                  <Heart className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="px-5 pb-5 -mt-6">
                  {/* Avatar */}
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-amber font-display text-base font-bold text-amber-foreground shadow-md">
                    {getInitials(company.name)}
                  </div>

                  <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                    {company.name}
                    {company.verified && (
                      <svg className="h-4 w-4 text-primary flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </h3>

                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {company.city}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" /> {company.sector}
                    </p>
                  </div>

                  <div className="mt-3">
                    <span className="inline-block rounded-lg border border-border px-2.5 py-1 text-xs text-muted-foreground">
                      {company.size}
                    </span>
                  </div>
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
