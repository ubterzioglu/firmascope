import { Helmet } from "react-helmet-async";
import { generateMeta } from "@/lib/seo";
import { normalizeRoutePath, toAbsoluteUrl } from "@/lib/site";

type SeoHeadProps = {
  meta: ReturnType<typeof generateMeta>;
  path?: string;
};

const SeoHead = ({ meta, path }: SeoHeadProps) => {
  const resolvedPath = normalizeRoutePath(path || meta.canonical.replace(/^https?:\/\/[^/]+/, ""));
  const alternateUrl = toAbsoluteUrl(resolvedPath);

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={meta.robots} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <link rel="canonical" href={meta.canonical} />
      <link rel="alternate" hrefLang="tr" href={alternateUrl} />
      <link rel="alternate" hrefLang="x-default" href={alternateUrl} />

      <meta property="og:title" content={meta.openGraph.title} />
      <meta property="og:description" content={meta.openGraph.description} />
      <meta property="og:type" content={meta.openGraph.type} />
      <meta property="og:url" content={meta.openGraph.url} />
      <meta property="og:image" content={meta.openGraph.image} />
      <meta property="og:locale" content="tr_TR" />

      <meta name="twitter:card" content={meta.twitter.card} />
      <meta name="twitter:title" content={meta.twitter.title} />
      <meta name="twitter:description" content={meta.twitter.description} />
      <meta name="twitter:image" content={meta.twitter.image} />
    </Helmet>
  );
};

export default SeoHead;
