import Layout from "@/components/Layout";
import Breadcrumb from "@/components/Breadcrumb";
import CompanyDirectoryGrid, {
  type DirectoryCompany,
  type DirectoryReviewStats,
} from "@/components/CompanyDirectoryGrid";
import JsonLd from "@/components/JsonLd";
import SeoHead from "@/components/SeoHead";
import { supabase } from "@/integrations/supabase/client";
import { generateJsonLd, generateMeta, seoConfig } from "@/lib/seo";
import { slugifyTaxonomyValue } from "@/lib/site";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type TaxonomyMode = "sector" | "city";

const taxonomyCopy: Record<TaxonomyMode, { title: string; intro: string; pathPrefix: string }> = {
  sector: {
    title: "Sektör",
    intro:
      "Bu landing page, aynı sektörde öne çıkan şirket yorumlarını, maaş sinyallerini ve mülakat deneyimlerini tek listede görmeyi kolaylaştırır.",
    pathPrefix: "/sektor",
  },
  city: {
    title: "Şehir",
    intro:
      "Bu landing page, aynı şehirdeki şirketleri karşılaştırıp kültür, ücret ve aday deneyimi tarafındaki ortak sinyalleri okumak için tasarlandı.",
    pathPrefix: "/sehir",
  },
};

const TaxonomyPage = ({ mode }: { mode: TaxonomyMode }) => {
  const { slug } = useParams();
  const [companies, setCompanies] = useState<DirectoryCompany[]>([]);
  const [reviewStats, setReviewStats] = useState<DirectoryReviewStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [compRes, statsRes] = await Promise.all([
        supabase.from("companies").select("id,name,slug,sector,city,size,logo_url,banner_url").eq("status", "Aktif").order("name"),
        supabase.from("reviews_public" as never).select("company_id, rating"),
      ]);

      const allCompanies = (compRes.data as DirectoryCompany[]) || [];
      const statsMap = new Map<string, { total: number; count: number }>();

      for (const row of (statsRes.data as Array<{ company_id: string; rating: number }> | null) || []) {
        const current = statsMap.get(row.company_id) || { total: 0, count: 0 };
        current.total += row.rating;
        current.count += 1;
        statsMap.set(row.company_id, current);
      }

      setReviewStats(
        Array.from(statsMap.entries()).map(([company_id, value]) => ({
          company_id,
          avg_rating: value.total / value.count,
          review_count: value.count,
        }))
      );

      setCompanies(allCompanies);
      setLoading(false);
    };

    fetchData();
  }, []);

  const matchingCompanies = useMemo(() => {
    if (!slug) {
      return [];
    }

    return companies.filter((company) => {
      const sourceValue = mode === "sector" ? company.sector : company.city;
      return sourceValue ? slugifyTaxonomyValue(sourceValue) === slug : false;
    });
  }, [companies, mode, slug]);

  const activeLabel = useMemo(() => {
    const firstMatch = matchingCompanies[0];
    if (!firstMatch) {
      return slug ? slug.replace(/-/g, " ") : taxonomyCopy[mode].title;
    }

    return (mode === "sector" ? firstMatch.sector : firstMatch.city) || taxonomyCopy[mode].title;
  }, [matchingCompanies, mode, slug]);

  const meta = generateMeta({
    title: `${activeLabel} şirket yorumları, maaş ve mülakat verileri`,
    description: `${activeLabel} odağında şirket yorumlarını, maaş sinyallerini ve mülakat deneyimlerini toplu şekilde inceleyin.`,
    path: `${taxonomyCopy[mode].pathPrefix}/${slug || ""}`,
    keywords: [
      `${activeLabel} şirket yorumları`,
      `${activeLabel} maaş`,
      `${activeLabel} mülakat`,
      `${activeLabel} firmascope`,
    ],
  });

  const breadcrumbJsonLd = generateJsonLd.breadcrumb([
    { name: "Ana Sayfa", item: `${seoConfig.siteUrl}/` },
    { name: "Şirketler", item: `${seoConfig.siteUrl}/sirketler` },
    { name: activeLabel, item: `${seoConfig.siteUrl}${taxonomyCopy[mode].pathPrefix}/${slug}` },
  ]);

  const collectionPageJsonLd = generateJsonLd.collectionPage({
    name: meta.title,
    description: meta.description,
    path: `${taxonomyCopy[mode].pathPrefix}/${slug || ""}`,
  });

  const itemListJsonLd = generateJsonLd.itemList(
    matchingCompanies.slice(0, 20).map((company) => ({
      name: company.name,
      url: `${seoConfig.siteUrl}/sirket/${company.slug}`,
    }))
  );

  const faqJsonLd = generateJsonLd.faq([
    {
      question: `${activeLabel} için şirket karşılaştırması nasıl yapılmalı?`,
      answer: `${activeLabel} filtresinde şirketleri karşılaştırırken yorum sayısı, ortalama puan, maaş girdisi ve mülakat deneyimlerini birlikte değerlendirmek gerekir.`,
    },
    {
      question: `${activeLabel} sayfası ne işe yarar?`,
      answer: `${activeLabel} odağındaki şirketleri tek listede görmenizi ve benzer bağlamdaki şirketler arasında daha hızlı karar vermenizi sağlar.`,
    },
  ]);

  return (
    <Layout>
      <SeoHead meta={meta} path={`${taxonomyCopy[mode].pathPrefix}/${slug || ""}`} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionPageJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />

      <section className="py-10">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "Ana Sayfa", href: "/" },
              { label: "Şirketler", href: "/sirketler" },
              { label: activeLabel },
            ]}
          />

          <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h1 className="font-display text-3xl font-bold text-foreground">
              {activeLabel} Şirket Yorumları, Maaş ve Mülakat Verileri
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              {taxonomyCopy[mode].intro} {activeLabel} sayfası, aynı bağlamda yer alan şirketleri tek tek aramak yerine daha hızlı bir pazar okuması yapmanıza yardımcı olur.
              Yorum yoğunluğu yüksek şirketleri önceliklendirip kültür, ücret ve süreç sinyallerini karşılaştırabilirsiniz.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-border/80 bg-background/80 p-5">
            <h2 className="font-display text-xl font-semibold text-foreground">{activeLabel} içinde öne çıkan şirketler</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {matchingCompanies.length} aktif şirket bulundu. Aynı sektörde veya şehirde yer alan şirketleri yan yana okuyarak daha isabetli kıyaslama yapabilirsiniz.
            </p>
          </div>

          {loading ? (
            <p className="py-12 text-center text-muted-foreground">Yükleniyor...</p>
          ) : matchingCompanies.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Bu filtre için henüz aktif şirket bulunamadı.
            </div>
          ) : (
            <div className="mt-6">
              <CompanyDirectoryGrid companies={matchingCompanies} reviewStats={reviewStats} />
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TaxonomyPage;
