import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Search, Home, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="flex flex-1 items-center justify-center py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Big 404 */}
          <div className="relative inline-block">
            <span className="font-display text-[10rem] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-alm-teal to-alm-green select-none md:text-[14rem]">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-16 w-16 text-foreground/10 md:h-24 md:w-24" />
            </div>
          </div>

          <h1 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Sayfa Bulunamadı
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
            Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            <br />
            <span className="font-mono text-xs text-muted-foreground/70">{location.pathname}</span>
          </p>

          {/* Action buttons */}
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild className="rounded-xl font-semibold text-sm h-11 px-6">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Ana Sayfa
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl font-semibold text-sm h-11 px-6 border-2">
              <Link to="/sirketler">
                <Building2 className="mr-2 h-4 w-4" />
                Şirketleri Keşfet
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl font-semibold text-sm h-11 px-6"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Button>
          </div>

          {/* Decorative pills */}
          <div className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-2 max-w-xs">
            {["Değerlendirmeler", "Maaşlar", "Mülakatlar", "Şirketler"].map((label, i) => {
              const colors = ["bg-alm-blue/15 text-primary", "bg-alm-green/15 text-alm-green", "bg-alm-orange/15 text-alm-orange", "bg-alm-teal/15 text-alm-teal"];
              return (
                <span
                  key={label}
                  className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium ${colors[i]} animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s`, animationDuration: "3s" }}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
