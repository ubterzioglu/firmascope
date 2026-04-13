export const seoConfig = {
  siteName: "firmascope",
  siteUrl: "https://www.firmascope.com",
  defaultImage: "https://www.firmascope.com/og-image.png",
  twitterHandle: "@firmascope",
  titleSuffix: "firmascope — Anonim Şirket Değerlendirme",
  defaultDescription:
    "Türkiye'deki şirketleri anonim olarak değerlendir. Maaş bilgileri, mülakat deneyimleri ve şirket kültürü hakkında gerçek çalışan verileri.",
};

type MetaInput = {
  title: string;
  description: string;
  path?: string;
  canonical?: string;
  robots?: "index,follow" | "noindex,nofollow";
  keywords?: string[];
  image?: string;
  type?: "website" | "article";
};

export const generateMeta = (input: MetaInput) => {
  const canonical = input.canonical || `${seoConfig.siteUrl}${input.path || "/"}`;
  const title = `${input.title} | ${seoConfig.titleSuffix}`;
  const image = input.image || seoConfig.defaultImage;
  const robots = input.robots || "index,follow";
  const keywords = input.keywords?.join(", ");

  return {
    title,
    description: input.description,
    canonical,
    robots,
    keywords,
    openGraph: {
      title,
      description: input.description,
      type: input.type || "website",
      url: canonical,
      image,
    },
    twitter: {
      title,
      description: input.description,
      image,
      card: "summary_large_image" as const,
      site: seoConfig.twitterHandle,
    },
  };
};

type BreadcrumbEntry = {
  name: string;
  item: string;
};

export const generateJsonLd = {
  organization: (sameAs: string[] = []) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/favicon.svg`,
    description: seoConfig.defaultDescription,
    sameAs,
  }),

  website: () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${seoConfig.siteUrl}/sirketler?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }),

  breadcrumb: (items: BreadcrumbEntry[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }),

  faq: (items: Array<{ question: string; answer: string }>) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }),

  webPage: (args: {
    name: string;
    description: string;
    path: string;
    type?: string;
    datePublished?: string;
    dateModified?: string;
    speakableSelectors?: string[];
  }) => ({
    "@context": "https://schema.org",
    "@type": args.type || "WebPage",
    name: args.name,
    description: args.description,
    url: `${seoConfig.siteUrl}${args.path}`,
    datePublished: args.datePublished || "2025-01-01",
    dateModified: args.dateModified || new Date().toISOString().split("T")[0],
    ...(args.speakableSelectors
      ? {
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: args.speakableSelectors,
          },
        }
      : {}),
  }),

  localBusiness: (args: {
    name: string;
    description?: string;
    path: string;
    city?: string;
    sector?: string;
    avgRating?: number;
    reviewCount?: number;
  }) => {
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: args.name,
      url: `${seoConfig.siteUrl}${args.path}`,
    };
    if (args.description) schema.description = args.description;
    if (args.city) schema.address = { "@type": "PostalAddress", addressLocality: args.city, addressCountry: "TR" };
    if (args.sector) schema.knowsAbout = args.sector;
    if (args.avgRating !== undefined && args.reviewCount !== undefined) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: args.avgRating.toFixed(1),
        bestRating: 5,
        worstRating: 1,
        reviewCount: args.reviewCount,
      };
    }
    return schema;
  },

  itemList: (items: Array<{ name: string; url: string }>) => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  }),
};
