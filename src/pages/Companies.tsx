import Layout from "@/components/Layout";
import { Search, MapPin, Building2, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/components/Breadcrumb";
import { generateJsonLd, generateMeta, seoConfig } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import SeoHead from "@/components/SeoHead";
import CompanyDirectoryGrid, {
  type DirectoryCompany,
  type DirectoryReviewStats,
} from "@/components/CompanyDirectoryGrid";

const cities = ["Tüm Şehirler", "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];
const sectors = ["Tüm Sektörler", "Teknoloji", "Finans", "Sağlık", "Enerji", "Lojistik", "Otomotiv", "Medya", "İnşaat", "Eğitim"];

const Companies = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("Tüm Şehirler");
  const [sector, setSector] = useState("Tüm Sektörler");
  const [companies, setCompanies] = useState<DirectoryCompany[]>([]);
  const [reviewStats, setReviewStats] = useState<DirectoryReviewStats[]>([]);
  const [loading, setLoading] = useState(true);

  const meta = generateMeta({
    title: "Şirketler ve kullanıcı yorumları",
    description:
      "Türkiye'deki şirket değerlendirmelerini, maaş verilerini ve mülakat deneyimlerini tek listede keşfedin.",
    path: "/sirketler",
    keywords: ["şirket değerlendirmeleri", "şirket yorumları", "mülakat deneyimleri"],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [compRes, statsRes] = await Promise.all([
        supabase.from("companies").select("*").eq("status", "Aktif").order("name"),
        supabase.from("reviews_public" as any).select("company_id, rating"),
      ]);

      setCompanies((compRes.data as DirectoryCompany[]) || []);

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

  const breadcrumbJsonLd = generateJsonLd.breadcrumb([
    { name: "Ana Sayfa", item: `${seoConfig.siteUrl}/` },
    { name: "Şirketler", item: `${seoConfig.siteUrl}/sirketler` },
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Türkiye'de şirket değerlendirmeleri",
    itemListElement: filtered.slice(0, 20).map((company, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${seoConfig.siteUrl}/sirket/${company.slug}`,
      name: company.name,
    })),
  };

  return (
    <Layout>
      <SeoHead meta={meta} path="/sirketler" />

      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={itemListJsonLd} />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: "Şirketler" }]} />
          <h1 className="mb-6 text-center font-display text-3xl font-bold text-foreground">Şirketler</h1>

          <div className="relative mx-auto mb-4 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Şirket ara..."
              className="h-11 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4 flex justify-center gap-3">
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
            <p className="py-12 text-center text-muted-foreground">Yükleniyor...</p>
          ) : (
            <>
              <p className="mb-6 text-center text-sm text-muted-foreground">{filtered.length} şirket bulundu</p>

              <CompanyDirectoryGrid companies={filtered} reviewStats={reviewStats} />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Companies;
