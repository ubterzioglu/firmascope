import Layout from "@/components/Layout";
import { generateMeta } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import SeoHead from "@/components/SeoHead";
import type { StaticPageContent } from "@/lib/footer-pages";

interface StaticContentPageProps {
  content: StaticPageContent;
}

const StaticContentPage = ({ content }: StaticContentPageProps) => {
  const meta = generateMeta({
    title: content.metaTitle,
    description: content.metaDescription,
    path: content.path,
  });

  return (
    <Layout>
      <SeoHead meta={meta} path={content.path} />

      <section className="py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <Breadcrumb items={[{ label: "Ana Sayfa", href: "/" }, { label: content.title }]} />
          <h1 className="font-display text-lg font-bold text-foreground">{content.title}</h1>
          <p className="mt-2 text-xs text-muted-foreground">{content.subtitle}</p>

          {content.intro && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{content.intro}</p>
          )}

          <div className="mt-8 space-y-4">
            {content.sections.map((section) => (
              <div key={section.title} className="rounded-xl border border-border bg-card p-4">
                <h2 className="font-display text-sm font-semibold text-foreground">{section.title}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default StaticContentPage;
